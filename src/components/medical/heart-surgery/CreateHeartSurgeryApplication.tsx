import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MedicalApplication,
  SurgeryType,
  createEmptyMedicalApplication,
} from '../../../types';
import { heartSurgeryService } from '../../../services/medicalApplicationService';
import { useToast } from '../../ui/Toast';
import { MedicalApplicationForm } from '../MedicalApplicationForm';

export const CreateHeartSurgeryApplication: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialValues] = useState<MedicalApplication>(
    createEmptyMedicalApplication(SurgeryType.HEART_SURGERY)
  );

  const handleSubmit = async (values: MedicalApplication, isSubmit = false) => {
    setSaving(true);
    try {
      const savedApplication = await heartSurgeryService.createApplication(values);

      showToast(
        'success',
        isSubmit ? 'Application Submitted' : 'Draft Saved',
        isSubmit
          ? 'Heart surgery application has been submitted successfully.'
          : 'Your draft has been saved.'
      );

      setHasUnsavedChanges(false);

      if (savedApplication.id) {
        navigate(`/medical/heart-surgery/${savedApplication.id}`);
      }
    } catch (error: any) {
      console.error('Error saving application:', error);
      showToast('error', 'Save Failed', error.message || 'Failed to save the application.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MedicalApplicationForm
      surgeryType={SurgeryType.HEART_SURGERY}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      saving={saving}
      isEditing={false}
      hasUnsavedChanges={hasUnsavedChanges}
      onExit={() => navigate('/medical/heart-surgery')}
    />
  );
};
