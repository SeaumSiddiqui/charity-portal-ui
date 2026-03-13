import React, { useState, useEffect, useRef } from 'react';
import { Formik, FormikProps } from 'formik';
import {
  MedicalApplication,
  SurgeryType,
  ApplicationStatus,
} from '../../types';
import {
  medicalApplicationSchema,
  partialMedicalApplicationSchema,
} from '../../utils/medicalValidationSchemas';
import { scrollToError } from '../../utils/validation';
import {
  PatientInformationForm,
  PatientFamilyMembersForm,
  PatientAddressForm,
  HouseholdInformationForm,
  ContactInformationForm,
} from './forms';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Carousel } from '../ui/Carousel';
import { MedicalFormTabs } from './shared/MedicalFormTabs';
import { MedicalFormNavigation } from './shared/MedicalFormNavigation';
import { MedicalStatusBadge } from './shared/MedicalStatusBadge';
import { RejectionAlert } from '../orphan/shared/RejectionAlert';
import { ExitWarningModal } from '../orphan/shared/ExitWarningModal';

interface MedicalApplicationFormProps {
  surgeryType: SurgeryType;
  initialValues: MedicalApplication;
  onSubmit: (values: MedicalApplication, isSubmit?: boolean) => Promise<void>;
  saving: boolean;
  isEditing?: boolean;
  hasUnsavedChanges: boolean;
  onExit?: () => void;
  showStatusChangeButton?: boolean;
  onStatusChange?: () => void;
}

const TAB_DEFINITIONS = [
  { id: 'patient', label: 'Patient Information', isValid: false, hasErrors: false },
  { id: 'address', label: 'Address', isValid: false, hasErrors: false },
  { id: 'household', label: 'Household', isValid: false, hasErrors: false },
  { id: 'family', label: 'Family Members', isValid: false, hasErrors: false },
  { id: 'contact', label: 'Contact', isValid: false, hasErrors: false },
];

const TAB_MAPPING: Record<string, string> = {
  patientInformation: 'patient',
  patientAddress: 'address',
  householdInformation: 'household',
  patientFamilyMembers: 'family',
  contactInformation: 'contact',
};

const getTabNameFromPath = (path: string): string => {
  if (path.startsWith('patientInformation')) return 'Patient Information';
  if (path.startsWith('patientAddress')) return 'Address';
  if (path.startsWith('householdInformation')) return 'Household';
  if (path.startsWith('patientFamilyMembers')) return 'Family Members';
  if (path.startsWith('contactInformation')) return 'Contact';
  return 'General';
};

const getApplicationTitle = (type: SurgeryType): string => {
  return type === SurgeryType.HEART_SURGERY
    ? 'Heart Surgery Application'
    : 'Eye Surgery Application';
};

export const MedicalApplicationForm: React.FC<MedicalApplicationFormProps> = ({
  surgeryType,
  initialValues,
  onSubmit,
  saving,
  isEditing = false,
  hasUnsavedChanges,
  onExit,
  showStatusChangeButton = false,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState('patient');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const { showToast } = useToast();
  const formContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formContentRef.current) {
      const yOffset = -40;
      const element = formContentRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeTab]);

  const tabs = TAB_DEFINITIONS;

  const handleSave = async (
    values: MedicalApplication,
    formik: FormikProps<MedicalApplication>,
    submit = false
  ) => {
    try {
      const validationSchema = submit ? medicalApplicationSchema : partialMedicalApplicationSchema;
      await validationSchema.validate(values, { abortEarly: false });

      let newStatus = values.status;

      if (submit) {
        if (
          [ApplicationStatus.NEW, ApplicationStatus.INCOMPLETE, ApplicationStatus.REJECTED].includes(
            values.status
          )
        ) {
          newStatus = ApplicationStatus.COMPLETE;
          showToast(
            'success',
            'Form Completed',
            'Application has been submitted successfully.'
          );
        }
      } else {
        if (values.status === ApplicationStatus.NEW) {
          newStatus = ApplicationStatus.INCOMPLETE;
        }
      }

      const applicationToSave = {
        ...values,
        status: newStatus,
        surgeryType,
      };

      await onSubmit(applicationToSave, submit);
    } catch (error: any) {
      if (error.inner && error.inner.length > 0) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
        });
        formik.setErrors(errors);

        const firstError = error.inner[0];
        const firstErrorTab = getTabNameFromPath(firstError.path);
        const errorCount = error.inner.length;
        const errorMessage =
          errorCount > 1
            ? `${firstError.message} (${errorCount} errors found)`
            : firstError.message;

        showToast('error', `Validation Error in ${firstErrorTab}`, errorMessage);

        const fieldPathPrefix = firstError.path.split('.')[0];
        const targetTab = TAB_MAPPING[fieldPathPrefix];

        if (targetTab && targetTab !== activeTab) {
          setActiveTab(targetTab);
          setTimeout(() => scrollToError(firstError.path), 300);
        } else {
          scrollToError(firstError.path);
        }
      } else {
        console.error('Save error:', error);
        showToast('error', 'Save Failed', 'An unexpected error occurred');
      }
    }
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    onExit?.();
  };

  const handleSaveAndExit = async (formik: FormikProps<MedicalApplication>) => {
    await handleSave(formik.values, formik, false);
    setShowExitWarning(false);
    onExit?.();
  };

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const canGoNext = currentTabIndex < tabs.length - 1;
  const canGoPrevious = currentTabIndex > 0;

  const goToNextTab = () => {
    if (canGoNext) setActiveTab(tabs[currentTabIndex + 1].id);
  };

  const goToPreviousTab = () => {
    if (canGoPrevious) setActiveTab(tabs[currentTabIndex - 1].id);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={partialMedicalApplicationSchema}
      onSubmit={(values) => onSubmit(values)}
      enableReinitialize
    >
      {(formik) => (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Carousel />
          <MedicalFormTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div ref={formContentRef} className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {isEditing ? 'Edit' : 'New'} {getApplicationTitle(surgeryType)}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Complete all sections to submit the application
                    </p>
                  </div>
                  <MedicalStatusBadge status={formik.values.status} />
                </div>
              </div>

              {formik.values.status === ApplicationStatus.REJECTED &&
                formik.values.rejectionMessage && (
                  <RejectionAlert message={formik.values.rejectionMessage} />
                )}

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
                <div className="p-8">
                  {activeTab === 'patient' && <PatientInformationForm formik={formik} />}
                  {activeTab === 'address' && <PatientAddressForm formik={formik} />}
                  {activeTab === 'household' && <HouseholdInformationForm formik={formik} />}
                  {activeTab === 'family' && <PatientFamilyMembersForm formik={formik} />}
                  {activeTab === 'contact' && <ContactInformationForm formik={formik} />}
                </div>
              </div>

              <MedicalFormNavigation
                tabs={tabs}
                currentTabIndex={currentTabIndex}
                onPreviousTab={goToPreviousTab}
                onNextTab={goToNextTab}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {showStatusChangeButton && (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={onStatusChange}
                      className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
                    >
                      Change Status
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleSave(formik.values, formik, true)}
                    loading={saving}
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
                  >
                    Submit Application
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleSave(formik.values, formik, false)}
                    loading={saving}
                    className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 dark:bg-teal-600 dark:hover:bg-teal-500"
                  >
                    Save as Draft
                  </Button>
                </div>

                {hasUnsavedChanges && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span>Unsaved changes</span>
                    </div>
                  </div>
                )}
              </div>

              <ExitWarningModal
                isOpen={showExitWarning}
                onCancel={() => setShowExitWarning(false)}
                onSaveAndExit={() => handleSaveAndExit(formik)}
                onExitWithoutSaving={handleConfirmExit}
                saving={saving}
              />
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};
