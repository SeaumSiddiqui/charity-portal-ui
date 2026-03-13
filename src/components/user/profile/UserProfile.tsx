import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PersonalInfo } from './PersonalInfo';
import { BankInfo } from './BankInfo';
import { ProgramsList } from './ProgramsList';
import { OrganizationProfile } from './OrganizationProfile';
import { Button } from '../../ui/Button';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import { UserMediaType } from '../../../types';

interface UserProfileProps {
  userId: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data: profile, loading, error, refetch } = useUserProfile(userId);
  const { user } = useAuth();

  const isOwnProfile = user?.id === userId;

  const isOrganizationUser = (roles: string[]) => {
    const orgRoles = ['api-agent', 'api-authenticator', 'api-admin'];
    console.log('Checking roles:', roles);
    const isOrg = roles.some(role => orgRoles.includes(role.toLowerCase()));
    console.log('Is organization user:', isOrg);
    return isOrg;
  };

  const handleUpdateField = async (field: string, value: string) => {
    if (!profile) return;

    try {
      await userService.updateUser(userId, {
        username: profile.username,
        email: profile.email,
        password: '',
        userType: profile.userRoles?.[0] || 'user',
        cell: field === 'cell' ? value : profile.cell,
        address: field === 'address' ? value : profile.address,
        bcregistration: field === 'bcregistration' ? value : profile.bcregistration,
        bankTitle: field === 'bankTitle' ? value : profile.bankTitle,
        accountTitle: field === 'accountTitle' ? value : profile.accountTitle,
        accountNumber: field === 'accountNumber' ? value : profile.accountNumber,
        branch: field === 'branch' ? value : profile.branch,
        routingNumber: field === 'routingNumber' ? value : profile.routingNumber,
      });
      await refetch();
    } catch (error) {
      console.error('Failed to update field:', error);
      throw error;
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      await userService.uploadUserMedia(userId, file, UserMediaType.AVATAR);
      await refetch();
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  };

  const handleUploadSignature = async (file: File) => {
    try {
      await userService.uploadUserMedia(userId, file, UserMediaType.SIGNATURE);
      await refetch();
    } catch (error) {
      console.error('Failed to upload signature:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-primary-900 dark:text-secondary-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>Troubleshooting tips:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Make sure your backend server is running</li>
              <li>• Check if the API endpoint is accessible</li>
              <li>• Verify your authentication token is valid</li>
            </ul>
          </div>
          <Button onClick={refetch} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
        </div>
      </div>
    );
  }

  const isOrgUser = isOrganizationUser(profile.userRoles || []);

  console.log('Profile loaded:', {
    username: profile.username,
    roles: profile.userRoles,
    isOrgUser,
    isOwnProfile
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isOwnProfile ? `Welcome back, ${profile.username}` : `${profile.username}'s Profile`}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isOrgUser
                ? 'Organization member profile and credentials'
                : 'Manage your profile and track your charity program enrollment'}
            </p>
          </div>

          {isOrgUser ? (
            <OrganizationProfile
              profile={profile}
              isOwnProfile={isOwnProfile}
              onUploadAvatar={handleUploadAvatar}
              onUploadSignature={handleUploadSignature}
              onUpdateField={handleUpdateField}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <PersonalInfo
                  profile={profile}
                  isOwnProfile={isOwnProfile}
                  onUpdateField={handleUpdateField}
                />
                <BankInfo
                  profile={profile}
                  isOwnProfile={isOwnProfile}
                  onUpdateField={handleUpdateField}
                />
              </div>

              <div>
                <ProgramsList programs={profile.programs || []} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
