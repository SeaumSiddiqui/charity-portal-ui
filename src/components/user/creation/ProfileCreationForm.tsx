import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, CreditCard, Building, Eye, EyeOff } from 'lucide-react';
import { UserCreateRequest, BeneficiaryCreateRequest, UserType, ValidationError } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';

interface ProfileCreationFormProps {
  userType: UserType;
  data: UserCreateRequest;
  onChange: (data: UserCreateRequest) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  errors: ValidationError[];
  mode?: 'create' | 'update';
  canManageUserType: (type: UserType) => boolean;
}

export const ProfileCreationForm: React.FC<ProfileCreationFormProps> = ({
  userType,
  data,
  onChange,
  onSubmit,
  onBack,
  loading,
  errors,
  mode = 'create',
  canManageUserType
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const handleChange = (field: keyof UserCreateRequest, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleBeneficiaryChange = (field: keyof BeneficiaryCreateRequest, value: any) => {
    // Only update if we have a beneficiaryCreateRequest object
    if (!data.beneficiaryCreateRequest) {
      return;
    }
    
    onChange({
      ...data,
      beneficiaryCreateRequest: {
        ...data.beneficiaryCreateRequest,
        [field]: value
      }
    });
  };

  const handleGroupChange = (role: string, checked: boolean) => {
    const currentGroups = data.groups || [];
    if (checked) {
      onChange({
        ...data,
        groups: [...currentGroups.filter(g => g !== role), role]
      });
    } else {
      onChange({
        ...data,
        groups: currentGroups.filter(g => g !== role)
      });
    }
  };

  const isRegularUser = userType === UserType.REGULAR;
  const availableRoles = isRegularUser 
    ? [{ value: 'qc-api-users', label: 'User (Beneficiary)' }]
    : [
        { value: 'qc-api-agent', label: 'Agent' },
        { value: 'qc-api-authenticator', label: 'Authenticator' },
        { value: 'qc-api-admins', label: 'Admin' }
      ];

  const isUpdateMode = mode === 'update';
  const actionText = isUpdateMode ? 'Update' : 'Create';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {actionText} {isRegularUser ? 'Regular' : 'Organization'} User Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isUpdateMode ? 'Update the user details' : 'Fill in the user details to create the account'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-secondary-900/30 rounded-lg">
                <User className="h-5 w-5 text-primary-900 dark:text-secondary-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Essential account details
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={data.username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                    getFieldError('username') ? 'border-red-400 dark:border-red-500' : ''
                  }`}
                  placeholder="Enter username"
                />
                {getFieldError('username') && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('username')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                      getFieldError('email') ? 'border-red-400 dark:border-red-500' : ''
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {getFieldError('email') && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password {isUpdateMode ? '(leave blank to keep current)' : '*'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                      getFieldError('password') ? 'border-red-400 dark:border-red-500' : ''
                    }`}
                    placeholder={isUpdateMode ? "Leave blank to keep current password" : "Enter password (min 8 characters)"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {getFieldError('password') && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('password')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={data.cell || ''}
                    onChange={(e) => handleChange('cell', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    value={data.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isEnabled"
                checked={data.isEnabled}
                onChange={(e) => handleChange('isEnabled', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable account (user can login)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary-100 dark:bg-primary-900/30 rounded-lg">
                <User className="h-5 w-5 text-secondary-500 dark:text-primary-900" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Roles
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assign roles to determine user permissions
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableRoles.map((role) => (
                <label key={role.value} className="flex items-center space-x-3 cursor-pointer">
                  {!canManageUserType(userType) && !isRegularUser && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                      ⚠️ You can only manage regular users
                    </div>
                  )}
                  <input
                    type="checkbox"
                    checked={data.groups?.includes(role.value) || false}
                    onChange={(e) => handleGroupChange(role.value, e.target.checked)}
                    disabled={!canManageUserType(userType) && !isRegularUser}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {role.label}
                  </span>
                </label>
              ))}
            </div>
            {getFieldError('groups') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('groups')}</p>
            )}
          </CardContent>
        </Card>

        {/* Banking Information - Only for Regular Users */}
        {isRegularUser && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Banking Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bank account details for payments
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    BC Registration
                  </label>
                  <input
                    type="text"
                    value={data.beneficiaryCreateRequest?.bcRegistration || ''}
                    onChange={(e) => handleBeneficiaryChange('bcRegistration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter BC registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Title
                  </label>
                  <input
                    type="text"
                    value={data.beneficiaryCreateRequest?.accountTitle || ''}
                    onChange={(e) => handleBeneficiaryChange('accountTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={data.beneficiaryCreateRequest?.accountNumber || ''}
                    onChange={(e) => handleBeneficiaryChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.beneficiaryCreateRequest?.bankTitle || ''}
                      onChange={(e) => handleBeneficiaryChange('bankTitle', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter bank name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={data.beneficiaryCreateRequest?.branch || ''}
                    onChange={(e) => handleBeneficiaryChange('branch', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter branch name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={data.beneficiaryCreateRequest?.routingNumber || ''}
                    onChange={(e) => handleBeneficiaryChange('routingNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter routing number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            {isUpdateMode ? 'Cancel' : 'Reset & Back to User Type'}
          </Button>
          
          <Button
            variant="primary"
            onClick={onSubmit}
            loading={loading}
            disabled={!data.username || !data.email || (!isUpdateMode && !data.password) || (data.groups?.length || 0) === 0}
          >
            {isRegularUser ? `${actionText} User` : `${actionText} User & Continue`}
          </Button>
        </div>
      </div>
    </div>
  );
};