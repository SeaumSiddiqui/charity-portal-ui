import { useState, useRef, useEffect, useCallback } from 'react';
import { FormikProps } from 'formik';
import { OrphanApplication, ApplicationStatus, Gender } from '../types';
import { orphanApplicationSchema, partialOrphanApplicationSchema } from '../utils/validationSchemas';
import { scrollToError } from '../utils/validation';

interface UseApplicationFormOptions {
  onSubmit: (values: OrphanApplication, isSubmit?: boolean) => Promise<void>;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  isEditing: boolean;
  targetUserId: string;
}

export const useApplicationForm = ({ onSubmit, showToast, isEditing, targetUserId }: UseApplicationFormOptions) => {
  const [activeTab, setActiveTab] = useState('primary');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<OrphanApplication | null>(null);
  const formContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formContentRef.current) {
      const yOffset = -40;
      const element = formContentRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeTab]);

  const getTabNameFromPath = (path: string): string => {
    if (path.startsWith('primaryInformation')) return 'Primary Information';
    if (path.startsWith('address')) return 'Address';
    if (path.startsWith('familyMembers')) return 'Family Members';
    if (path.startsWith('basicInformation')) return 'Basic Information';
    if (path.startsWith('verification')) return 'Verification';
    return 'General';
  };

  const handleSave = useCallback(async (
    values: OrphanApplication,
    formik: FormikProps<OrphanApplication>,
    submit = false
  ) => {
    try {
      const validationSchema = submit ? orphanApplicationSchema : partialOrphanApplicationSchema;
      await validationSchema.validate(values, { abortEarly: false });

      let newStatus = values.status;

      if (submit) {
        if ([ApplicationStatus.NEW, ApplicationStatus.INCOMPLETE, ApplicationStatus.REJECTED].includes(values.status)) {
          newStatus = ApplicationStatus.COMPLETE;
          setTimeout(() => {
            setActiveTab('documents');
            showToast('success', 'Form Completed', 'Please upload all required documents to submit the application.');
          }, 1000);
        }
      } else {
        if (values.status === ApplicationStatus.NEW) {
          newStatus = ApplicationStatus.INCOMPLETE;
        }
      }

      const applicationToSave = {
        ...values,
        status: newStatus,
        beneficiaryUserId: isEditing ? values.beneficiaryUserId : targetUserId
      };

      await onSubmit(applicationToSave, submit);
    } catch (error: any) {
      if (error.inner && error.inner.length > 0) {
        const errors: { [key: string]: string } = {};

        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
        });

        formik.setErrors(errors);

        const firstError = error.inner[0];
        const firstErrorTab = getTabNameFromPath(firstError.path);
        const errorCount = error.inner.length;

        const errorMessage = errorCount > 1
          ? `${firstError.message} (${errorCount} errors found)`
          : firstError.message;

        showToast('error', `Validation Error in ${firstErrorTab}`, errorMessage);

        const tabMapping: { [key: string]: string } = {
          'primaryInformation': 'primary',
          'address': 'address',
          'familyMembers': 'family',
          'basicInformation': 'basic',
          'documents': 'documents',
          'verification': 'verification'
        };

        const fieldPathPrefix = firstError.path.split('.')[0];
        const targetTab = tabMapping[fieldPathPrefix];

        if (targetTab && targetTab !== activeTab) {
          setActiveTab(targetTab);
          setTimeout(() => {
            scrollToError(firstError.path);
          }, 300);
        } else {
          scrollToError(firstError.path);
        }
      } else {
        console.error('Save error:', error);
        showToast('error', 'Save Failed', 'An unexpected error occurred');
      }
    }
  }, [isEditing, targetUserId, onSubmit, showToast, activeTab]);

  const handleSiblingsChange = useCallback((count: number, formik: FormikProps<OrphanApplication>) => {
    const currentMembers = formik.values.familyMembers || [];
    let updatedMembers = [...currentMembers];

    if (count > currentMembers.length) {
      for (let i = currentMembers.length; i < count; i++) {
        updatedMembers.push({
          name: '',
          age: 0,
          siblingsGrade: 0,
          occupation: '',
          siblingsGender: Gender.MALE,
          maritalStatus: 'UNMARRIED' as any,
        });
      }
    } else if (count < currentMembers.length) {
      updatedMembers = updatedMembers.slice(0, count);
    }

    formik.setFieldValue('familyMembers', updatedMembers);
  }, []);

  const handlePreview = useCallback((values: OrphanApplication) => {
    setPreviewData(values);
    setShowPreview(true);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  return {
    activeTab,
    setActiveTab,
    showExitWarning,
    setShowExitWarning,
    showPreview,
    previewData,
    formContentRef,
    handleSave,
    handleSiblingsChange,
    handlePreview,
    closePreview,
  };
};
