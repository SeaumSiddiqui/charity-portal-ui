import React from 'react';
import { Users, Building, User, Shield } from 'lucide-react';
import { UserType } from '../../../types';
import { Card, CardContent } from '../../../components/ui/Card';

interface UserTypeSelectorProps {
  selectedType: UserType | null;
  onTypeSelect: (type: UserType) => void;
  canManageUserType: (type: UserType) => boolean;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  canManageUserType
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Select User Type
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the type of user account you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Regular User */}
        <Card 
          className={`transition-all duration-200 ${
            canManageUserType(UserType.REGULAR) 
              ? 'cursor-pointer hover:shadow-lg' 
              : 'opacity-50 cursor-not-allowed'
          } ${
            selectedType === UserType.REGULAR 
              ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'hover:border-primary-300 dark:hover:border-secondary-500'
          }`}
          onClick={() => canManageUserType(UserType.REGULAR) && onTypeSelect(UserType.REGULAR)}
        >
          <CardContent className="p-8 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              selectedType === UserType.REGULAR 
                ? 'bg-primary-500 text-white' 
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              <Users className="h-8 w-8" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Regular User
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Beneficiaries who apply for charity programs
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <User className="h-4 w-4" />
                <span>Role: app-user</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                <Building className="h-4 w-4" />
                <span>Includes banking information</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                • Personal details
                <br />
                • Contact information
                <br />
                • Bank account details
              </div>
            </div>
          </CardContent>
        </Card>

        {/* In Organization User */}
        <Card 
          className={`transition-all duration-200 ${
            canManageUserType(UserType.IN_ORGANIZATION) 
              ? 'cursor-pointer hover:shadow-lg' 
              : 'opacity-50 cursor-not-allowed'
          } ${
            selectedType === UserType.IN_ORGANIZATION 
              ? 'ring-2 ring-secondary-500 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20' 
              : 'hover:border-secondary-300 dark:hover:border-secondary-500'
          }`}
          onClick={() => canManageUserType(UserType.IN_ORGANIZATION) && onTypeSelect(UserType.IN_ORGANIZATION)}
        >
          <CardContent className="p-8 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              selectedType === UserType.IN_ORGANIZATION 
                ? 'bg-secondary-500 text-white' 
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
            }`}>
              <Shield className="h-8 w-8" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              In Organization User
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Staff members who manage charity operations
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <Shield className="h-4 w-4" />
                <span>Roles: agent, authenticator, admin</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400">
                <User className="h-4 w-4" />
                <span>Includes avatar & signature</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                • Basic profile information
                <br />
                • Contact details
                <br />
                • Digital signature & avatar
              </div>
            </div>
            
            {!canManageUserType(UserType.IN_ORGANIZATION) && (
              <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-400 text-center">
                  Only admins can create organization users
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};