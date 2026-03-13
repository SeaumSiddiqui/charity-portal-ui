import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, User, Users, DollarSign, Eye } from 'lucide-react';
import {
  MedicalApplication,
  MedicalApplicationType,
  ApplicationStatus,
} from '../../../types';
import { eyeSurgeryService } from '../../../services/medicalApplicationService';
import { useToast } from '../../ui/Toast';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { Button } from '../../ui/Button';
import { Carousel } from '../../ui/Carousel';
import { MedicalStatusBadge } from '../shared/MedicalStatusBadge';
import { StatusChangeModal } from '../../orphan/shared/StatusChangeModal';

export const EyeSurgeryApplicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [application, setApplication] = useState<MedicalApplication | null>(null);
  const [loading, setLoading] = useState(true);
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

  const patient = application.patientInformation;
  const familyMembers = application.patientFamilyMembers || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Carousel />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/medical/eye-surgery')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-teal-500" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Eye Surgery Application
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Application ID: {application.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MedicalStatusBadge status={application.status} />
              <Button
                variant="outline"
                onClick={() => navigate(`/medical/eye-surgery/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowStatusModal(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Change Status
              </Button>
            </div>
          </div>

          {application.status === ApplicationStatus.REJECTED && application.rejectionMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                Rejection Reason
              </h3>
              <p className="text-red-700 dark:text-red-300">{application.rejectionMessage}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Patient Information
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Case ID
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.caseId || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full Name
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white font-medium">
                      {patient?.fullName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date of Birth
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.dateOfBirth || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Gender
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.gender || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Parents Information
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Father's Name
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.fathersName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Father's Profession
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.fathersProfession || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mother's Name
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.mothersName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mother's Profession
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.mothersProfession || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Financial Information
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Annual Income
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.annualIncome || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Family Member Count
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {patient?.familyMemberCount ?? 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {familyMembers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Family Members
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {familyMembers.length} member{familyMembers.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {familyMembers.map((member, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30"
                      >
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Family Member {index + 1}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Name:</span>
                            <p className="text-gray-900 dark:text-white">{member.name || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Age:</span>
                            <p className="text-gray-900 dark:text-white">{member.age ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Marital Status:</span>
                            <p className="text-gray-900 dark:text-white">{member.maritalStatus || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Grade:</span>
                            <p className="text-gray-900 dark:text-white">{member.grade ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Occupation:</span>
                            <p className="text-gray-900 dark:text-white">{member.occupation || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <StatusChangeModal
        isOpen={showStatusModal}
        currentStatus={application.status}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
