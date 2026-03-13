import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Download, CreditCard as Edit, Trash2, User, Calendar, ArrowUpDown, ArrowUp, ArrowDown, Eye, RefreshCw, FileText } from 'lucide-react';
import { MedicalApplicationSummaryDTO, MedicalApplicationFilters, ApplicationStatus } from '../../../../types';
import { Badge } from '../../../ui/Badge';
import { Card } from '../../../ui/Card';
import { useAuth } from '../../../../hooks/useAuth';

interface HeartSurgeryApplicationsTableProps {
  applications: MedicalApplicationSummaryDTO[];
  filters: MedicalApplicationFilters;
  onSort: (field: string) => void;
  onPageSizeChange: (size: number) => void;
  onView: (applicationId: string) => void;
  onEdit: (applicationId: string) => void;
  onDelete: (applicationId: string) => void;
  onChangeStatus: (applicationId: string, currentStatus: ApplicationStatus) => void;
  onManageMedia?: (applicationId: string) => void;
  onDownloadZip?: (applicationId: string) => void;
}

export const HeartSurgeryApplicationsTable: React.FC<HeartSurgeryApplicationsTableProps> = ({
  applications,
  filters,
  onSort,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
  onManageMedia,
  onDownloadZip
}) => {
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { hasAnyRole, isAdmin, isAgent, isAuthenticator } = useAuth();

  const canEditApplication = (status: ApplicationStatus): boolean => {
    if (status === 'GRANTED') return false;
    return isAdmin() || isAgent();
  };

  const canChangeStatus = (status: ApplicationStatus): boolean => {
    if (status === 'PENDING' || status === 'ACCEPTED') return isAdmin() || isAgent() || isAuthenticator();
    return false;
  };

  const canDeleteApplication = (status: ApplicationStatus): boolean => {
    if (status === 'GRANTED') return false;
    return isAdmin();
  };

  const canManageMedia = (status: ApplicationStatus): boolean => {
    return status === ApplicationStatus.COMPLETE && (isAdmin() || isAgent());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
    };

    if (actionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('ID copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy ID:', err);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.COMPLETE:
        return 'success';
      case ApplicationStatus.PENDING:
        return 'warning';
      case ApplicationStatus.REJECTED:
        return 'error';
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.GRANTED:
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSortIcon = (field: string): React.ReactNode => {
    if (filters.sortField === field) {
      return filters.sortDirection === 'ASC' ?
        <ArrowUp className="h-3 w-3" /> :
        <ArrowDown className="h-3 w-3" />;
    }
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  };

  return (
    <Card>
      {/* Table Controls */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-end">
          {/* Page Size Control */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</span>
            <select
              value={filters.size || 10}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('patientInformation.code')}
              >
                <div className="flex items-center space-x-1">
                  <span>Code</span>
                  <span className="text-teal-600 dark:text-teal-500">
                    {getSortIcon('patientInformation.code')}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('patientInformation.fullName')}
              >
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                  <span className="text-teal-600 dark:text-teal-500">
                    {getSortIcon('patientInformation.fullName')}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('patientInformation.dateOfBirth')}
              >
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date of Birth</span>
                  <span className="text-teal-600 dark:text-teal-500">
                    {getSortIcon('patientInformation.dateOfBirth')}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('patientInformation.fathersName')}
              >
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Father's Name</span>
                  <span className="text-teal-600 dark:text-teal-500">
                    {getSortIcon('patientInformation.fathersName')}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('patientInformation.gender')}
              >
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Gender</span>
                  <span className="text-teal-600 dark:text-teal-500">
                    {getSortIcon('patientInformation.gender')}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <span className="text-teal-600 dark:text-teal-500">
                    {getSortIcon('status')}
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative group">
                    <div
                      className="text-sm font-mono text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded transition-colors duration-200 max-w-[120px] truncate"
                      onClick={() => copyToClipboard(application.id)}
                      title="Click to copy ID"
                    >
                      {application.id}
                    </div>

                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                      <div className="font-mono">{application.id}</div>
                      <div className="text-gray-300 dark:text-gray-400 mt-1">Click to copy</div>
                      {/* Arrow */}
                      <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {application.code || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {application.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {application.dateOfBirth ? formatDate(application.dateOfBirth) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {application.fathersName || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white capitalize">
                    {application.gender ? application.gender.toLowerCase() : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(application.status as ApplicationStatus)}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative" ref={actionMenuOpen === application.id ? menuRef : null}>
                    <button
                      onClick={() => setActionMenuOpen(actionMenuOpen === application.id ? null : application.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {actionMenuOpen === application.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onView(application.id);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4 mr-3" />
                            View
                          </button>
                          {canEditApplication(application.status as ApplicationStatus) && (
                            <button
                              onClick={() => {
                                onEdit(application.id);
                                setActionMenuOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit
                            </button>
                          )}
                          {canManageMedia(application.status as ApplicationStatus) && onManageMedia && (
                            <button
                              onClick={() => {
                                onManageMedia(application.id);
                                setActionMenuOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                            >
                              <FileText className="h-4 w-4 mr-3" />
                              Manage Documents
                            </button>
                          )}
                          {onDownloadZip && (
                            <button
                              onClick={() => {
                                onDownloadZip(application.id);
                                setActionMenuOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Download className="h-4 w-4 mr-3" />
                              Download ZIP
                            </button>
                          )}
                          {canChangeStatus(application.status as ApplicationStatus) && (
                            <button
                              onClick={() => {
                                onChangeStatus(application.id, application.status as ApplicationStatus);
                                setActionMenuOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <RefreshCw className="h-4 w-4 mr-3" />
                              Change Status
                            </button>
                          )}
                          {canDeleteApplication(application.status as ApplicationStatus) && (
                            <button
                              onClick={() => {
                                onDelete(application.id);
                                setActionMenuOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
