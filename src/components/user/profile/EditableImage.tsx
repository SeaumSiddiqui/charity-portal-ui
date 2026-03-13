import React, { useState, useRef } from 'react';
import { User, Eye, Upload, X } from 'lucide-react';

interface EditableImageProps {
  imageUrl?: string;
  alt: string;
  onUpload: (file: File) => Promise<void>;
  onView?: () => void;
  canEdit: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EditableImage: React.FC<EditableImageProps> = ({
  imageUrl,
  alt,
  onUpload,
  onView,
  canEdit,
  size = 'lg',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleUploadClick = () => {
    setShowMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleViewClick = () => {
    setShowMenu(false);
    if (onView) {
      onView();
    } else if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 relative cursor-pointer`}
        onMouseEnter={() => canEdit && setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowMenu(false);
        }}
        onClick={() => canEdit && setShowMenu(!showMenu)}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-gray-400" />
          </div>
        )}

        {canEdit && isHovered && !isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-xs font-medium">Click to edit</div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {canEdit && showMenu && !isUploading && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10 min-w-[150px]">
          {imageUrl && onView && (
            <button
              onClick={handleViewClick}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Image
            </button>
          )}
          <button
            onClick={handleUploadClick}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload New
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
