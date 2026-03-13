import React, { useState, useEffect } from 'react';
import { FileSignature, User, Mail, Phone, MapPin, Upload, Eye, Building2, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { EditableField } from './EditableField';
import { UserProfile } from '../../../types';
import { userService } from '../../../services/userService';

interface OrganizationProfileProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onUploadAvatar: (file: File) => Promise<void>;
  onUploadSignature: (file: File) => Promise<void>;
  onUpdateField: (field: string, value: string) => Promise<void>;
}

export const OrganizationProfile: React.FC<OrganizationProfileProps> = ({
  profile,
  isOwnProfile,
  onUploadAvatar,
  onUploadSignature,
  onUpdateField,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [signatureUrl, setSignatureUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isHoveredAvatar, setIsHoveredAvatar] = useState(false);
  const [isHoveredSignature, setIsHoveredSignature] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      try {
        try {
          const avatarResponse = await userService.authenticatedFetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}/users/media/${profile.userId}/file/AVATAR`
          );
          if (avatarResponse.ok) {
            const url = await avatarResponse.text();
            setAvatarUrl(url);
          }
        } catch (error) {
          console.log('No avatar found');
        }

        try {
          const signatureResponse = await userService.authenticatedFetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}/users/media/${profile.userId}/file/SIGNATURE`
          );
          if (signatureResponse.ok) {
            const url = await signatureResponse.text();
            setSignatureUrl(url);
          }
        } catch (error) {
          console.log('No signature found');
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [profile.userId]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      await onUploadAvatar(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSignature(true);
    try {
      await onUploadSignature(file);
      const url = URL.createObjectURL(file);
      setSignatureUrl(url);
    } catch (error) {
      console.error('Failed to upload signature:', error);
    } finally {
      setIsUploadingSignature(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Card with Avatar and Basic Info */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"></div>
        <CardContent className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            <div
              className="relative -mt-16 mb-4 sm:mb-0"
              onMouseEnter={() => setIsHoveredAvatar(true)}
              onMouseLeave={() => setIsHoveredAvatar(false)}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg relative bg-white dark:bg-gray-800">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                    <User className="w-16 h-16 text-blue-600 dark:text-blue-300" />
                  </div>
                )}

                {isOwnProfile && isHoveredAvatar && !isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-6 h-6 text-white mb-1" />
                      <span className="text-white text-xs font-medium">Upload</span>
                    </label>
                  </div>
                )}

                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              )}
            </div>

            {/* Name and Status */}
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Organization Member</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Badge variant={profile.isEnabled ? 'success' : 'error'} className="text-sm px-3 py-1">
                    {profile.isEnabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-900 dark:text-white truncate">{profile.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <EditableField
                  label=""
                  value={profile.cell || 'Not provided'}
                  icon={<Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  onSave={(value) => onUpdateField('cell', value)}
                  canEdit={isOwnProfile}
                  type="tel"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <EditableField
                  label=""
                  value={profile.address || 'Not provided'}
                  icon={<MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  onSave={(value) => onUpdateField('address', value)}
                  canEdit={isOwnProfile}
                  type="text"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles and Signature Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Roles</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {(profile.userRoles || []).map((role, index) => (
                <Badge key={index} variant="info" className="text-sm px-3 py-1">
                  {role}
                </Badge>
              ))}
              {(!profile.userRoles || profile.userRoles.length === 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Digital Signature */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <FileSignature className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Digital Signature</h3>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setIsHoveredSignature(true)}
              onMouseLeave={() => setIsHoveredSignature(false)}
            >
              {signatureUrl ? (
                <div className="relative w-full h-32 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white">
                  <img src={signatureUrl} alt="Signature" className="w-full h-full object-contain p-3" />
                  {isOwnProfile && isHoveredSignature && !isUploadingSignature && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-3">
                      <button
                        onClick={() => window.open(signatureUrl, '_blank')}
                        className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                        title="View signature"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                      <label htmlFor="signature-upload" className="p-3 bg-white rounded-lg hover:bg-gray-100 cursor-pointer transition-colors shadow-lg" title="Upload new signature">
                        <Upload className="w-5 h-5 text-gray-700" />
                      </label>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 ${
                    isOwnProfile ? 'cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20 transition-all' : ''
                  }`}
                  onClick={() => isOwnProfile && document.getElementById('signature-upload')?.click()}
                >
                  <FileSignature className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                    {isOwnProfile ? 'Click to upload signature' : 'No signature uploaded'}
                  </p>
                </div>
              )}

              {isUploadingSignature && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {isOwnProfile && (
              <input
                id="signature-upload"
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="hidden"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
