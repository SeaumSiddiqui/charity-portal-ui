import React from 'react';
import { User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { EditableField } from './EditableField';
import { UserProfile } from '../../../types';

interface PersonalInfoProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onUpdateField: (field: string, value: string) => Promise<void>;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ profile, isOwnProfile, onUpdateField }) => {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-secondary-900/30 rounded-lg">
            <User className="h-5 w-5 text-primary-900 dark:text-secondary-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your account and contact details
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Username</p>
                <p className="text-gray-600 dark:text-gray-400 truncate">{profile.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                <p className="text-gray-600 dark:text-gray-400 truncate">{profile.email}</p>
              </div>
            </div>

            <EditableField
              label="Phone"
              value={profile.cell || ''}
              icon={<Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />}
              onSave={(value) => onUpdateField('cell', value)}
              canEdit={isOwnProfile}
              type="tel"
            />
          </div>

          <div className="space-y-4">
            <EditableField
              label="Address"
              value={profile.address || ''}
              icon={<MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />}
              onSave={(value) => onUpdateField('address', value)}
              canEdit={isOwnProfile}
              type="text"
            />

            <EditableField
              label="BC Registration"
              value={profile.bcregistration || ''}
              icon={<CreditCard className="h-5 w-5 text-gray-400 flex-shrink-0" />}
              onSave={(value) => onUpdateField('bcregistration', value)}
              canEdit={isOwnProfile}
              type="text"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Account Status</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current status of your account</p>
            </div>
            <Badge variant={profile.isEnabled ? 'success' : 'error'}>
              {profile.isEnabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">User Roles</p>
          <div className="flex flex-wrap gap-2">
            {(profile.userRoles || []).map((role, index) => (
              <Badge key={index} variant="info">
                {role}
              </Badge>
            ))}
            {(!profile.userRoles || profile.userRoles.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
