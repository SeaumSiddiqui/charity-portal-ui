import React, { useState } from 'react';
import { Upload, User, FileText, CheckCircle, X, Eye } from 'lucide-react';
import { UserMediaType } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';

interface MediaUploadFormProps {
  userId: string;
  onUpload: (file: File, type: UserMediaType) => Promise<void>;
  onComplete: () => void;
  onSkip: () => void;
  loading: boolean;
  mode?: 'create' | 'update';
}

interface UploadedFile {
  file: File;
  preview: string;
  uploaded: boolean;
}

export const MediaUploadForm: React.FC<MediaUploadFormProps> = ({
  userId,
  onUpload,
  onComplete,
  onSkip,
  loading,
  mode = 'create'
}) => {
  const [avatarFile, setAvatarFile] = useState<UploadedFile | null>(null);
  const [signatureFile, setSignatureFile] = useState<UploadedFile | null>(null);
  const [uploadingType, setUploadingType] = useState<UserMediaType | null>(null);

  const isUpdateMode = mode === 'update';
  const actionText = isUpdateMode ? 'Update' : 'Upload';

  // Check if both files are uploaded
  const bothFilesUploaded = avatarFile?.uploaded && signatureFile?.uploaded;
  const handleFileSelect = (type: UserMediaType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    const uploadedFile: UploadedFile = {
      file,
      preview,
      uploaded: false
    };

    if (type === UserMediaType.AVATAR) {
      setAvatarFile(uploadedFile);
    } else {
      setSignatureFile(uploadedFile);
    }
  };

  const triggerFileInput = (type: UserMediaType) => {
    const inputId = type === UserMediaType.AVATAR ? 'avatar-input' : 'signature-input';
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };
  const handleUpload = async (type: UserMediaType) => {
    const file = type === UserMediaType.AVATAR ? avatarFile : signatureFile;
    if (!file) return;

    try {
      setUploadingType(type);
      await onUpload(file.file, type);
      
      // Mark as uploaded
      const updatedFile = { ...file, uploaded: true };
      if (type === UserMediaType.AVATAR) {
        setAvatarFile(updatedFile);
      } else {
        setSignatureFile(updatedFile);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingType(null);
    }
  };

  const removeFile = (type: UserMediaType) => {
    if (type === UserMediaType.AVATAR) {
      if (avatarFile?.preview) {
        URL.revokeObjectURL(avatarFile.preview);
      }
      setAvatarFile(null);
    } else {
      if (signatureFile?.preview) {
        URL.revokeObjectURL(signatureFile.preview);
      }
      setSignatureFile(null);
    }
  };


  const FileUploadSection: React.FC<{
    type: UserMediaType;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    file: UploadedFile | null;
    color: string;
  }> = ({ type, title, description, icon: Icon, file, color }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${color} rounded-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="relative">
              <img
                src={file.preview}
                alt={`${title} preview`}
                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
              <button
                onClick={() => removeFile(type)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={uploadingType === type}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {file.uploaded ? (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Uploaded</span>
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleUpload(type)}
                    loading={uploadingType === type}
                    disabled={loading}
                    className="min-w-[80px]"
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-400 dark:hover:border-secondary-500 transition-colors duration-200 cursor-pointer"
            onClick={() => triggerFileInput(type)}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Upload {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput(type);
                }}
              >
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
              </Button>
            </div>
            {/* Hidden file inputs */}
            <input
              id={type === UserMediaType.AVATAR ? 'avatar-input' : 'signature-input'}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(type, e)}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {actionText} Avatar & Signature
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isUpdateMode ? 'Update the media files for the organization user' : 'Upload the required media files for the organization user'}
        </p>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-400">
            <strong>User ID:</strong> <code className="font-mono">{userId}</code>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FileUploadSection
            type={UserMediaType.AVATAR}
            title="Avatar"
            description="Profile picture for the user"
            icon={User}
            file={avatarFile}
            color="from-blue-500 to-indigo-500"
          />

          <FileUploadSection
            type={UserMediaType.SIGNATURE}
            title="Digital Signature"
            description="Digital signature for document verification"
            icon={FileText}
            file={signatureFile}
            color="from-purple-500 to-indigo-500"
          />
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload Progress
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {[avatarFile?.uploaded, signatureFile?.uploaded].filter(Boolean).length} / 2 completed
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${([avatarFile?.uploaded, signatureFile?.uploaded].filter(Boolean).length / 2) * 100}%`
                }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className={`flex items-center space-x-2 ${avatarFile?.uploaded ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {avatarFile?.uploaded ? <CheckCircle className="h-4 w-4" /> : <User className="h-4 w-4" />}
                <span>Avatar {avatarFile?.uploaded ? 'uploaded' : 'pending'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${signatureFile?.uploaded ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {signatureFile?.uploaded ? <CheckCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                <span>Signature {signatureFile?.uploaded ? 'uploaded' : 'pending'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={loading}
          >
            Skip
          </Button>
          
          <Button
            variant="primary"
            onClick={onComplete}
            disabled={loading || !bothFilesUploaded}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};