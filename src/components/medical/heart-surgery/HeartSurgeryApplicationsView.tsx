import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MedicalApplicationSummaryDTO,
  MedicalApplicationFilters,
  ApplicationStatus,
  PageResponse
} from '../../../types';
import { heartSurgeryService } from '../../../services/medicalApplicationService';
import { useToast } from '../../ui/Toast';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { Carousel } from '../../ui/Carousel';
import { HeartSurgeryApplicationsHeader } from './applications/HeartSurgeryApplicationsHeader';
import { HeartSurgeryApplicationsTable } from './applications/HeartSurgeryApplicationsTable';
import { HeartSurgeryApplicationsPagination } from './applications/HeartSurgeryApplicationsPagination';
import { HeartSurgeryEmptyState } from './applications/HeartSurgeryEmptyState';
import { HeartSurgeryApplicationsFilters } from './applications/HeartSurgeryApplicationsFilters';
import { HeartSurgeryExportModal } from './applications/HeartSurgeryExportModal';
import { StatusChangeModal } from '../../orphan/shared/StatusChangeModal';
import { HeartSurgeryMediaModal } from './HeartSurgeryMediaModal';
import { useAuth } from '../../../hooks/useAuth';
import { downloadService } from '../../../services/downloadService';

export const HeartSurgeryApplicationsView: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasAnyRole } = useAuth();
  const [applications, setApplications] = useState<PageResponse<MedicalApplicationSummaryDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusChangeModal, setStatusChangeModal] = useState<{ applicationId: string; currentStatus: ApplicationStatus } | null>(null);
  const [mediaModalApplicationId, setMediaModalApplicationId] = useState<string | null>(null);
  const [filters, setFilters] = useState<MedicalApplicationFilters>({
    page: 0,
    size: 10,
    sortField: 'createdAt',
    sortDirection: 'DESC'
  });

  const hasStaffAccess = hasAnyRole(['app-agent', 'app-authenticator', 'app-admin']);

  useEffect(() => {
    if (hasStaffAccess) {
      fetchApplications();
    }
  }, [filters, hasStaffAccess]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await heartSurgeryService.getAllApplications(filters);
      setApplications(response);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      showToast('error', 'Load Failed', error.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setFilters(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  const handleFilterChange = (key: keyof MedicalApplicationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 0,
      size: filters.size,
      sortField: 'createdAt',
      sortDirection: 'DESC'
    });
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleConfirmExport = async (selectedHeaders: string[]) => {
    try {
      setIsExporting(true);
      const blob = await heartSurgeryService.exportToExcel(filters, selectedHeaders);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `heart-surgery-applications-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('success', 'Export Successful', 'Applications have been exported to Excel.');
      setShowExportModal(false);
    } catch (error: any) {
      console.error('Error exporting applications:', error);
      showToast('error', 'Export Failed', error.message || 'Failed to export applications.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      await heartSurgeryService.deleteApplication(id);
      showToast('success', 'Deleted', 'Application has been deleted successfully.');
      fetchApplications();
    } catch (error: any) {
      console.error('Error deleting application:', error);
      showToast('error', 'Delete Failed', error.message || 'Failed to delete application.');
    }
  };

  const handleChangeStatus = (applicationId: string, currentStatus: ApplicationStatus) => {
    setStatusChangeModal({ applicationId, currentStatus });
  };

  const handleConfirmStatusChange = async (newStatus: ApplicationStatus, rejectionMessage?: string) => {
    if (!statusChangeModal) return;

    try {
      await heartSurgeryService.updateApplicationStatus(statusChangeModal.applicationId, newStatus, rejectionMessage);
      showToast('success', 'Status Updated', `Application status has been changed to ${newStatus}.`);
      setStatusChangeModal(null);
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('error', 'Update Failed', 'Failed to update application status. Please try again.');
      throw error;
    }
  };

  const handleDownloadZip = async (applicationId: string) => {
    try {
      showToast('info', 'Downloading', 'Preparing download, please wait...');
      await downloadService.downloadHeartSurgeryApplicationWithDocuments(applicationId);
      showToast('success', 'Download Complete', 'Application ZIP file has been downloaded.');
    } catch (error: any) {
      console.error('Failed to download ZIP:', error);
      showToast('error', 'Download Failed', error.message || 'Failed to download application.');
    }
  };

  if (!hasStaffAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only accessible to staff members.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Carousel */}
      <Carousel />

      {/* Header */}
      <HeartSurgeryApplicationsHeader
        applications={applications}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCreateNew={() => navigate('/medical/heart-surgery/create')}
        onRefresh={fetchApplications}
        onExport={handleExport}
        loading={loading}
      />

      {/* Filters */}
      {showFilters && (
        <HeartSurgeryApplicationsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" message="Loading applications..." fullScreen={false} />
            </div>
          ) : applications?.content.length === 0 ? (
            <HeartSurgeryEmptyState
              filters={filters}
              onCreateNew={() => navigate('/medical/heart-surgery/create')}
            />
          ) : (
            <>
              {/* Applications Table */}
              <HeartSurgeryApplicationsTable
                applications={applications?.content || []}
                filters={filters}
                onSort={handleSort}
                onPageSizeChange={handlePageSizeChange}
                onView={(id) => navigate(`/medical/heart-surgery/${id}`)}
                onEdit={(id) => navigate(`/medical/heart-surgery/${id}/edit`)}
                onDelete={handleDelete}
                onChangeStatus={handleChangeStatus}
                onManageMedia={(id) => setMediaModalApplicationId(id)}
                onDownloadZip={handleDownloadZip}
              />

              {/* Pagination */}
              {applications && (
                <HeartSurgeryApplicationsPagination
                  pageData={applications}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      <StatusChangeModal
        isOpen={!!statusChangeModal}
        currentStatus={statusChangeModal?.currentStatus || ApplicationStatus.PENDING}
        onClose={() => setStatusChangeModal(null)}
        onConfirm={handleConfirmStatusChange}
      />

      <HeartSurgeryExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleConfirmExport}
        isExporting={isExporting}
      />

      <HeartSurgeryMediaModal
        isOpen={!!mediaModalApplicationId}
        applicationId={mediaModalApplicationId || ''}
        onClose={() => setMediaModalApplicationId(null)}
      />
    </div>
  );
};
