import React from 'react';
import { User } from 'lucide-react';
import { UserProfile } from '../../../types';

interface UserSelectorProps {
  targetUserId: string;
  onUserIdChange: (userId: string) => void;
  userProfile?: UserProfile | null;
  profileLoading: boolean;
  profileError: any;
  isEditing?: boolean;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  targetUserId,
  onUserIdChange,
  userProfile,
  profileLoading,
  profileError,
  isEditing = false
}) => {
  if (isEditing) return null;

  return (
    <div className={`border rounded-lg p-4 mb-6 ${
      profileLoading 
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        : userProfile 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : profileError && targetUserId
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }`}>
      <div className="flex items-center space-x-3 mb-3">
        <User className={`h-5 w-5 ${
          profileLoading 
            ? 'text-yellow-600 dark:text-yellow-400'
            : userProfile 
            ? 'text-green-600 dark:text-green-400'
            : profileError && targetUserId
            ? 'text-red-600 dark:text-red-400'
            : 'text-blue-600 dark:text-blue-400'
        }`} />
        <h3 className={`text-sm font-medium ${
          profileLoading 
            ? 'text-yellow-800 dark:text-yellow-400'
            : userProfile 
            ? 'text-green-800 dark:text-green-400'
            : profileError && targetUserId
            ? 'text-red-800 dark:text-red-400'
            : 'text-blue-800 dark:text-blue-400'
        }`}>
          {profileLoading ? 'Loading User...' : userProfile ? 'User Found' : profileError && targetUserId ? 'User Not Found' : 'User Information'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            profileLoading 
              ? 'text-yellow-700 dark:text-yellow-300'
              : userProfile 
              ? 'text-green-700 dark:text-green-300'
              : profileError && targetUserId
              ? 'text-red-700 dark:text-red-300'
              : 'text-blue-700 dark:text-blue-300'
          }`}>
            User ID *
          </label>
          <input
            type="text"
            value={targetUserId}
            onChange={(e) => onUserIdChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
              profileLoading 
                ? 'border-yellow-200 dark:border-yellow-500 dark:bg-yellow-900/20'
                : userProfile 
                ? 'border-green-200 dark:border-green-500 dark:bg-green-900/20'
                : profileError && targetUserId
                ? 'border-red-200 dark:border-red-500 dark:bg-red-900/20'
                : 'border-blue-200 dark:border-blue-500 dark:bg-blue-900/20'
            }`}
            placeholder="Enter the user ID"
          />
        </div>
        
        {userProfile && (
          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={userProfile.username}
              readOnly
              className="w-full px-3 py-2 border border-green-300 dark:border-green-500 rounded-md text-sm bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 cursor-not-allowed"
            />
          </div>
        )}
      </div>
      
      {profileLoading && (
        <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b border-yellow-600 mr-2"></div>
          Loading user profile...
        </p>
      )}
      
      {userProfile && (
        <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <p className="text-xs text-green-700 dark:text-green-300">
            <strong>Email:</strong> {userProfile.email} |
            <strong> BC Registration:</strong> {userProfile.bcregistration || 'Not provided'} |
            <strong> Status:</strong> {userProfile.isEnabled ? 'Active' : 'Inactive'}
          </p>
        </div>
      )}
      
      {!profileLoading && !userProfile && !profileError && (
        <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
          Enter a User ID to load profile information and start creating the application.
        </p>
      )}
      
      {profileError && targetUserId && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          User not found. Please check the User ID and try again.
        </p>
      )}
    </div>
  );
};