import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MedicalApplication,
  SurgeryType,
} from '../../../types';
import { eyeSurgeryService } from '../../../services/medicalApplicationService';
import { useToast } from '../../ui/Toast';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { MedicalApplicationForm } from '../MedicalApplicationForm';
import { StatusChangeModal } from '../../orphan/shared/StatusChangeModal';

export const UpdateEyeSurgeryApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [application, setApplication] = useState<MedicalApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await eyeSurgeryService.getApplication(id);
        setApplication(data);
      } catch (error: any) {
        console.error('Error fetching application:', error);
        showToast('error', 'Load Failed', error.message || 'Failed to load the application.');
        navigate('/medical/eye-surgery');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate, showToast]);

  const handleSubmit = async (values: MedicalApplication, isSubmit = false) => {
    if (!id) return;

    setSaving(true);
    try {
      const updatedApplication = await eyeSurgeryService.updateApplication(id, values);

      showToast(
        'success',
        isSubmit ? 'Application Updated' : 'Draft Saved',
        isSubmit
          ? 'Eye surgery application has been updated successfully.'
          : 'Your changes have been saved.'
      );

      setApplication(updatedApplication);
      setHasUnsavedChanges(false);
    } catch (error: any) {
      console.error('Error updating application:', error);
      showToast('error', 'Update Failed', error.message || 'Failed to update the application.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string, rejectionMessage?: string) => {
    if (!id) return;

    try {
      const updatedApplication = await eyeSurgeryService.updateApplicationStatus(
        id,
        newStatus,
        rejectionMessage
      );

      setApplication(updatedApplication);
      setShowStatusModal(false);
      showToast('success', 'Status Updated', `Application status changed to ${newStatus}.`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      showToast('error', 'Status Update Failed', error.message || 'Failed to update the status.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested application could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MedicalApplicationForm
        surgeryType={SurgeryType.EYE_SURGERY}
        initialValues={application}
        onSubmit={handleSubmit}
        saving={saving}
        isEditing={true}
        hasUnsavedChanges={hasUnsavedChanges}
        onExit={() => navigate(`/medical/eye-surgery/${id}`)}
        showStatusChangeButton={true}
        onStatusChange={() => setShowStatusModal(true)}
      />

      <StatusChangeModal
        isOpen={showStatusModal}
        currentStatus={application.status}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};
