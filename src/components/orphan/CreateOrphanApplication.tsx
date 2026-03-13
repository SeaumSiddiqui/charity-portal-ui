import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrphanApplication, ApplicationStatus, PhysicalCondition, Gender } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useToast } from '../ui/Toast';
import { applicationService } from '../../services/applicationService';
import { OrphanApplicationForm } from './OrphanApplicationForm';

interface CreateOrphanApplicationProps {}

export const CreateOrphanApplication: React.FC<CreateOrphanApplicationProps> = () => {
  const navigate = useNavigate();
  const { user, hasAnyRole } = useAuth();
  const [targetUserId, setTargetUserId] = useState('');
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  const [errorShownForUserId, setErrorShownForUserId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const { data: userProfile, loading: profileLoading, error: profileError } = useUserProfile(targetUserId);

  const hasStaffAccess = hasAnyRole(['app-agent', 'app-authenticator', 'app-admin']);

  const initialValues: OrphanApplication = {
    status: ApplicationStatus.NEW,   
    primaryInformation: {
      fullName: '',
      dateOfBirth: '',
      bcRegistration: '',
      placeOfBirth: '',
      age: 0,
      gender: Gender.MALE,
      fathersName: '',
      dateOfDeath: '',
      causeOfDeath: '',
      mothersName: '',
      mothersOccupation: '',
      mothersStatus: undefined,
      fixedAssets: '',
      annualIncome: '',
      numOfSiblings: 0,
      academicInstitution: '',
      grade: 0
    },
    address: {
      isSameAsPermanent: false,
      permanentDistrict: '',
      permanentSubDistrict: '',
      permanentUnion: '',
      permanentVillage: '',
      permanentArea: '',
      presentDistrict: '',
      presentSubDistrict: '',
      presentUnion: '',
      presentVillage: '',
      presentArea: ''
    },
    familyMembers: [],
    basicInformation: {
      physicalCondition: PhysicalCondition.HEALTHY,
      hasCriticalIllness: false,
      typeOfIllness: '',
      isResident: true,
      residenceStatus: undefined,
      houseType: undefined,
      bedroom: 0,
      balcony: false,
      kitchen: false,
      store: false,
      hasTubeWell: false,
      toilet: false,
      guardiansName: '',
      guardiansRelation: '',
      NID: '',
      cell1: '',
      cell2: ''
    }
  };

  // Auto-fill BC Registration from user profile
  useEffect(() => {
    if (userProfile && !userProfileLoaded) {
      setUserProfileLoaded(true);
      showToast('success', 'User Found', `Profile loaded for ${userProfile.username}`);
    }
  }, [userProfile, userProfileLoaded, showToast]);

  // Reset profile loaded state and error tracking when user ID changes
  useEffect(() => {
    setUserProfileLoaded(false);
    setErrorShownForUserId(null);
  }, [targetUserId]);

  // Show error if user profile fails to load
  useEffect(() => {
    if (profileError && targetUserId && errorShownForUserId !== targetUserId) {
      showToast('error', 'User Not Found', `No user found with ID: ${targetUserId}`);
      setErrorShownForUserId(targetUserId);
    }
  }, [profileError, targetUserId, errorShownForUserId, showToast]);

  const handleSubmit = async (values: OrphanApplication, isSubmit = false) => {
    const updatedApplication: OrphanApplication = { 
      ...values,
      beneficiaryUserId: targetUserId,
      primaryInformation: {
        ...values.primaryInformation,
        fullName: values.primaryInformation?.fullName || '',
        dateOfBirth: values.primaryInformation?.dateOfBirth || '',
        fathersName: values.primaryInformation?.fathersName || '',
        age: values.primaryInformation?.age || 0,
        gender: values.primaryInformation?.gender || Gender.MALE,
        numOfSiblings: values.primaryInformation?.numOfSiblings || 0,
        grade: values.primaryInformation?.grade || 0,
        bcRegistration: userProfile?.bcregistration || values.primaryInformation?.bcRegistration || ''
      }
    };

    try {
      setSaving(true);
      const savedApplication = await applicationService.createApplication(updatedApplication);

      setHasUnsavedChanges(false);

      if (isSubmit) {
        showToast('success', 'Application Submitted', 'Your application has been submitted successfully!');
        navigate('/applications');
      } else {
        showToast('success', 'Application Saved', 'Your application has been saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save application:', error);
      showToast('error', 'Save Failed', 'Failed to save application. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  if (!hasStaffAccess) {
    return null;
  }

  // Update initial values with BC registration from user profile
  const formInitialValues: OrphanApplication = React.useMemo(() => ({
    ...initialValues,
    primaryInformation: {
      ...initialValues.primaryInformation!,  // Assert non-null
      bcRegistration: userProfile?.bcregistration || initialValues.primaryInformation?.bcRegistration || '',
      // Ensure all required string fields have default values
      fullName: initialValues.primaryInformation?.fullName || '',
      dateOfBirth: initialValues.primaryInformation?.dateOfBirth || '',
      nationality: initialValues.primaryInformation?.nationality || 'Bangladeshi',
      placeOfBirth: initialValues.primaryInformation?.placeOfBirth || '',
      fathersName: initialValues.primaryInformation?.fathersName || '',
      mothersName: initialValues.primaryInformation?.mothersName || '',
      religion: initialValues.primaryInformation?.religion || '',
      // Ensure all required number fields have default values
      age: initialValues.primaryInformation?.age || 0,
      grade: initialValues.primaryInformation?.grade || 0,
      numOfSiblings: initialValues.primaryInformation?.numOfSiblings || 0,
      // For optional fields, you can keep them as is
      mothersStatus: initialValues.primaryInformation?.mothersStatus,
      mothersOccupation: initialValues.primaryInformation?.mothersOccupation || '',
      fixedAssets: initialValues.primaryInformation?.fixedAssets || '',
      annualIncome: initialValues.primaryInformation?.annualIncome || '',
      academicInstitution: initialValues.primaryInformation?.academicInstitution || '',
    }
  }), [userProfile?.bcregistration, initialValues]);

  return (
    <OrphanApplicationForm
      initialValues={formInitialValues}
      onSubmit={handleSubmit}
      saving={saving}
      targetUserId={targetUserId}
      onUserIdChange={setTargetUserId}
      userProfile={userProfile}
      profileLoading={profileLoading}
      profileError={profileError}
      isEditing={false}
      hasUnsavedChanges={hasUnsavedChanges}
      onExit={() => navigate('/applications')}
    />
  );
};