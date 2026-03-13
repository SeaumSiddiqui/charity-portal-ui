import React, { useState, useEffect, useRef } from 'react';
import { Formik, FormikProps } from 'formik';
import { AlertCircle, User } from 'lucide-react';
import { OrphanApplication, ApplicationStatus, Gender, UserProfile, Verification } from '../../types';
import { orphanApplicationSchema, partialOrphanApplicationSchema } from '../../utils/validationSchemas';
import { scrollToError } from '../../utils/validation';
import { PrimaryInformationFormik } from '../forms/PrimaryInformationFormik';
import { AddressFormik } from '../forms/AddressFormik';
import { FamilyMembersFormik } from '../forms/FamilyMembersFormik';
import { BasicInformationFormik } from '../forms/BasicInformationFormik';
import { VerificationForm } from './forms/VerificationForm';
import { DocumentsForm } from './forms/DocumentsForm';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Carousel } from '../ui/Carousel';
import { FormTabs } from './shared/FormTabs';
import { FormNavigation } from './shared/FormNavigation';
import { UserSelector } from './shared/UserSelector';
import { ApplicationDocumentView } from './shared/ApplicationDocumentView';
import { ApplicationStatusBadge } from './shared/ApplicationStatusBadge';
import { RejectionAlert } from './shared/RejectionAlert';
import { ExitWarningModal } from './shared/ExitWarningModal';

interface OrphanApplicationFormProps {
  initialValues: OrphanApplication;
  onSubmit: (values: OrphanApplication, isSubmit?: boolean) => Promise<void>;
  saving: boolean;
  targetUserId: string;
  onUserIdChange: (userId: string) => void;
  userProfile?: UserProfile | null;
  profileLoading: boolean;
  profileError: any;
  isEditing?: boolean;
  hasUnsavedChanges: boolean;
  onExit?: () => void;
  showStatusChangeButton?: boolean;
  onStatusChange?: () => void;
}

const TAB_DEFINITIONS = [
  { id: 'primary', label: 'Primary Information', isValid: false, hasErrors: false },
  { id: 'address', label: 'Address', isValid: false, hasErrors: false },
  { id: 'family', label: 'Family Members', isValid: false, hasErrors: false },
  { id: 'basic', label: 'Basic Information', isValid: false, hasErrors: false },
  { id: 'documents', label: 'Documents', isValid: false, hasErrors: false },
  { id: 'verification', label: 'Verification', isValid: false, hasErrors: false },
];

const TAB_MAPPING: Record<string, string> = {
  primaryInformation: 'primary',
  address: 'address',
  familyMembers: 'family',
  basicInformation: 'basic',
  documents: 'documents',
  verification: 'verification',
};

const getTabNameFromPath = (path: string): string => {
  if (path.startsWith('primaryInformation')) return 'Primary Information';
  if (path.startsWith('address')) return 'Address';
  if (path.startsWith('familyMembers')) return 'Family Members';
  if (path.startsWith('basicInformation')) return 'Basic Information';
  if (path.startsWith('verification')) return 'Verification';
  return 'General';
};

export const OrphanApplicationForm: React.FC<OrphanApplicationFormProps> = ({
  initialValues,
  onSubmit,
  saving,
  targetUserId,
  onUserIdChange,
  userProfile,
  profileLoading,
  profileError,
  isEditing = false,
  hasUnsavedChanges,
  onExit,
  showStatusChangeButton = false,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState('primary');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<OrphanApplication | null>(null);
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

  const tabs = TAB_DEFINITIONS.filter((tab) => {
    if (tab.id === 'documents') {
      return initialValues.id && initialValues.status !== 'INCOMPLETE';
    }
    return true;
  });

  const handleSave = async (
    values: OrphanApplication,
    formik: FormikProps<OrphanApplication>,
    submit = false
  ) => {
    try {
      const validationSchema = submit ? orphanApplicationSchema : partialOrphanApplicationSchema;
      await validationSchema.validate(values, { abortEarly: false });

      let newStatus = values.status;

      if (submit) {
        if (
          [ApplicationStatus.NEW, ApplicationStatus.INCOMPLETE, ApplicationStatus.REJECTED].includes(
            values.status
          )
        ) {
          newStatus = ApplicationStatus.COMPLETE;
          setTimeout(() => {
            setActiveTab('documents');
            showToast(
              'success',
              'Form Completed',
              'Please upload all required documents to submit the application.'
            );
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
        beneficiaryUserId: isEditing ? values.beneficiaryUserId : targetUserId,
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

  const handleSaveAndExit = async (formik: FormikProps<OrphanApplication>) => {
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

  const handlePreview = (values: OrphanApplication) => {
    setPreviewData(values);
    setShowPreview(true);
  };

  if (!isEditing && !targetUserId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Carousel />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <UserSelector
              targetUserId={targetUserId}
              onUserIdChange={onUserIdChange}
              userProfile={userProfile}
              profileLoading={profileLoading}
              profileError={profileError}
              isEditing={isEditing}
            />
            <div className="text-center py-12">
              <User className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Enter User ID to Begin
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please enter a User ID above to load the user profile and start creating the orphan
                application.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditing && targetUserId && profileError && !profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Carousel />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <UserSelector
              targetUserId={targetUserId}
              onUserIdChange={onUserIdChange}
              userProfile={userProfile}
              profileLoading={profileLoading}
              profileError={profileError}
              isEditing={isEditing}
            />
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-16 w-16 text-red-400 dark:text-red-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                User Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No user found with ID "{targetUserId}". Please check the User ID and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditing && !userProfile) {
    return null;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={partialOrphanApplicationSchema}
      onSubmit={(values) => onSubmit(values)}
      enableReinitialize
    >
      {(formik) => (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Carousel />
          <FormTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onPreview={() => handlePreview(formik.values)}
          />

          <div ref={formContentRef} className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <UserSelector
                  targetUserId={targetUserId}
                  onUserIdChange={onUserIdChange}
                  userProfile={userProfile}
                  profileLoading={profileLoading}
                  profileError={profileError}
                  isEditing={isEditing}
                />

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {isEditing ? 'Edit' : 'New'} Orphan Application
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Complete all sections to submit your application
                    </p>
                  </div>
                  <ApplicationStatusBadge status={formik.values.status} />
                </div>
              </div>

              {formik.values.status === ApplicationStatus.REJECTED &&
                formik.values.rejectionMessage && (
                  <RejectionAlert message={formik.values.rejectionMessage} />
                )}

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
                <div className="p-8">
                  {activeTab === 'primary' && (
                    <PrimaryInformationFormik
                      formik={formik}
                      userProfile={userProfile}
                      isEditing={isEditing}
                    />
                  )}
                  {activeTab === 'address' && <AddressFormik formik={formik} />}
                  {activeTab === 'family' && <FamilyMembersFormik formik={formik} />}
                  {activeTab === 'basic' && <BasicInformationFormik formik={formik} />}
                  {activeTab === 'documents' && (
                    <DocumentsForm
                      applicationId={formik.values.id}
                      applicationStatus={formik.values.status}
                      onStatusChange={(status) => formik.setFieldValue('status', status)}
                      errors={[]}
                    />
                  )}
                  {activeTab === 'verification' && (
                    <VerificationForm data={formik.values.verification as Verification} />
                  )}
                </div>
              </div>

              <FormNavigation
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
                      className="w-full sm:w-auto"
                    >
                      Change Status
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleSave(formik.values, formik, true)}
                    loading={saving}
                    className="w-full sm:w-auto"
                  >
                    Submit Application
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleSave(formik.values, formik, false)}
                    loading={saving}
                    className="w-full sm:w-auto"
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

              {previewData && (
                <ApplicationDocumentView
                  application={previewData}
                  isOpen={showPreview}
                  onClose={() => setShowPreview(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};
