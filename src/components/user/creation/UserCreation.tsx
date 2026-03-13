import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCreateRequest, UserType, UserCreationState, UserMediaType, ValidationError } from '../../../types';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../components/ui/Toast';
import { Carousel } from '../../../components/ui/Carousel';
import { UserTypeSelector } from './UserTypeSelector';
import { ProfileCreationForm } from './ProfileCreationForm';
import { MediaUploadForm } from './MediaUploadForm';

interface UserCreationProps {
  mode?: 'create' | 'update';
  existingUserId?: string;
  existingUserData?: UserCreateRequest;
}

export const UserCreation: React.FC<UserCreationProps> = ({
  mode = 'create',
  existingUserId,
  existingUserData
}) => {
  const navigate = useNavigate();
  const { isAdmin, isAgent } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const [state, setState] = useState<UserCreationState>({
    step: 1,
    userType: existingUserData?.beneficiaryCreateRequest ? UserType.REGULAR : UserType.IN_ORGANIZATION,
    profileData: existingUserData || {
      username: '',
      email: '',
      password: '',
      isEnabled: true,
      groups: [],
      cell: '',
      address: '',
      beneficiaryCreateRequest: undefined
    },
    isUpdate: mode === 'update',
    existingUserId,
    createdUserId: existingUserId
  });

  // Role-based access control
  const hasCreateAccess = isAdmin() || isAgent();
  const hasUpdateAccess = isAdmin() || isAgent();

  // Agent restrictions
  const canManageUserType = (userType: UserType) => {
    if (isAdmin()) return true;
    if (isAgent()) return userType === UserType.REGULAR;
    return false;
  };

  const validateProfileData = (data: UserCreateRequest): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.username?.trim()) {
      errors.push({ field: 'username', message: 'Username is required' });
    }

    if (!data.email?.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!data.password?.trim()) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (data.password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    if (!data.groups || data.groups.length === 0) {
      errors.push({ field: 'groups', message: 'At least one role must be selected' });
    }

    return errors;
  };

  const handleUserTypeSelect = (userType: UserType) => {
    if (!canManageUserType(userType)) {
      showToast('error', 'Access Denied', 'Agents can only manage regular users.');
      return;
    }
    
    setState(prev => ({
      ...prev,
      userType,
      profileData: {
        ...prev.profileData,
        groups: userType === UserType.REGULAR ? ['qc-api-users'] : [],
        beneficiaryCreateRequest: userType === UserType.REGULAR ? {
          bcRegistration: '',
          accountTitle: '',
          accountNumber: '',
          bankTitle: '',
          branch: '',
          routingNumber: ''
        } : undefined
      }
    }));
  };

  const handleProfileDataChange = (profileData: UserCreateRequest) => {
    setState(prev => ({ ...prev, profileData }));
    setErrors([]); // Clear errors when user makes changes
  };

  const handleProfileSubmit = async () => {
    const validationErrors = validateProfileData(state.profileData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showToast('error', 'Validation Error', 'Please fix the errors before continuing.');
      return;
    }

    try {
      setLoading(true);
      setErrors([]);
      
      let userId: string;
      
      if (state.isUpdate && state.existingUserId) {
        userId = await userService.updateUser(state.existingUserId, state.profileData);
        showToast('success', 'User Updated', 'User profile has been updated successfully!');
      } else {
        userId = await userService.createUser(state.profileData);
        showToast('success', 'User Created', 'User profile has been created successfully!');
      }
      
      setState(prev => ({ ...prev, createdUserId: userId }));

      if (state.userType === UserType.REGULAR) {
        // Regular users are complete after profile creation
        navigate('/');
      } else {
        // Organization users need to upload media
        setState(prev => ({ ...prev, step: 2 }));
        if (!state.isUpdate) {
          showToast('info', 'Next Step', 'Now upload avatar and signature files.');
        }
      }
    } catch (error) {
      console.error('Profile creation failed:', error);
      const action = state.isUpdate ? 'update' : 'create';
      showToast('error', `${action.charAt(0).toUpperCase() + action.slice(1)} Failed`, 
        error instanceof Error ? error.message : `Failed to ${action} user profile.`);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (file: File, type: UserMediaType) => {
    if (!state.createdUserId) {
      throw new Error('No user ID available for media upload');
    }

    try {
      await userService.uploadUserMedia(state.createdUserId, file, type);
      showToast('success', 'Upload Complete', `${type.toLowerCase()} uploaded successfully!`);
    } catch (error) {
      console.error('Media upload failed:', error);
      showToast('error', 'Upload Failed', error instanceof Error ? error.message : `Failed to upload ${type.toLowerCase()}.`);
      throw error;
    }
  };

  const handleMediaComplete = () => {
    const action = state.isUpdate ? 'updated' : 'created';
    showToast('success', `User ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      `Organization user has been ${action} successfully with all media files!`);
    navigate('/');
  };

  const handleMediaSkip = () => {
    const action = state.isUpdate ? 'updated' : 'created';
    showToast('success', `User ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      `Organization user has been ${action} successfully!`);
    navigate('/');
  };

  const handleBackToUserType = () => {
    setState(prev => ({ 
      ...prev, 
      userType: UserType.REGULAR, // Reset to default
      profileData: {
        username: '',
        email: '',
        password: '',
        isEnabled: true,
        groups: [],
        cell: '',
        address: '',
        beneficiaryCreateRequest: undefined
      }
    }));
    setErrors([]);
  };

  const hasAccess = mode === 'create' ? hasCreateAccess : hasUpdateAccess;
  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Carousel />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Step 1: User Type Selection and Profile Creation */}
          {state.step === 1 && (
            <div className="space-y-8">
              {!state.isUpdate && (
                <UserTypeSelector
                  selectedType={state.userType}
                  onTypeSelect={handleUserTypeSelect}
                  canManageUserType={canManageUserType}
                />
              )}
              
              {state.userType && (
                <ProfileCreationForm
                  userType={state.userType}
                  data={state.profileData}
                  onChange={handleProfileDataChange}
                  onSubmit={handleProfileSubmit}
                  onBack={state.isUpdate ? (() => navigate('/')) : handleBackToUserType}
                  loading={loading}
                  errors={errors}
                  mode={mode}
                  canManageUserType={canManageUserType}
                />
              )}
            </div>
          )}

          {/* Step 2: Media Upload (Organization Users Only) */}
          {state.step === 2 && state.createdUserId && (
            <MediaUploadForm
              userId={state.createdUserId}
              onUpload={handleMediaUpload}
              onComplete={handleMediaComplete}
              onSkip={handleMediaSkip}
              loading={loading}
              mode={mode}
            />
          )}
        </div>
      </div>
    </div>
  );
};