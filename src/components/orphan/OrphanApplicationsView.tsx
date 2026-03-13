import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrphanApplicationSummaryDTO, PageResponse, OrphanApplicationFilters, ApplicationStatus } from '../../types';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/Toast';
import { Carousel } from '../ui/Carousel';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ApplicationsHeader } from './applications/ApplicationsHeader';
import { ApplicationsFilters } from './applications/ApplicationsFilters';
import { ApplicationsTable } from './applications/ApplicationsTable';
import { ApplicationsPagination } from './applications/ApplicationsPagination';
import { EmptyState } from './applications/EmptyState';
import { downloadService } from '../../services/downloadService';
import { StatusChangeModal } from './shared/StatusChangeModal';
import { ExportModal } from './applications/ExportModal';

interface OrphanApplicationsViewProps {}

export const OrphanApplicationsView: React.FC<OrphanApplicationsViewProps> = () => {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const [applications, setApplications] = useState<PageResponse<OrphanApplicationSummaryDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [statusChangeModal, setStatusChangeModal] = useState<{ applicationId: string; currentStatus: ApplicationStatus } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<OrphanApplicationFilters>({
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
      const response = await applicationService.getAllApplications(filters);
      setApplications(response);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      showToast('error', 'Fetch Failed', 'Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof OrphanApplicationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0 // Reset to first page when filters change
    }));
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

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      await applicationService.deleteApplication(applicationId);
      showToast('success', 'Application Deleted', 'The application has been deleted successfully.');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete application:', error);
      showToast('error', 'Delete Failed', 'Failed to delete application. Please try again.');
    }
  };

  const handleDownload = (application: OrphanApplicationSummaryDTO) => {
    const downloadAsync = async () => {
      try {
        showToast('info', 'Download Started', 'Preparing application documents for download...');
        //await downloadService.downloadApplicationDocuments(application.id);
        await downloadService.downloadApplicationWithDocuments(application);
        
        showToast('success', 'Download Complete', 'All application documents have been downloaded as ZIP file.');
      } catch (error) {
        console.error('Download failed:', error);
        showToast('error', 'Download Failed', 'Failed to download application documents. Please try again.');
      }
    };
    
    downloadAsync();
  };

  const clearFilters = () => {
    setFilters({
      page: 0,
      size: 10,
      sortField: 'createdAt',
      sortDirection: 'DESC'
    });
  };

  const handleExport = async (selectedHeaders: string[]) => {
    try {
      setIsExporting(true);
      const { page, size, ...filtersWithoutPagination } = filters;
      const blob = await applicationService.exportToExcel(filtersWithoutPagination, selectedHeaders);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orphan-applications-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('success', 'Export Successful', 'Applications exported to Excel successfully.');
      setShowExportModal(false);
    } catch (error) {
      console.error('Failed to export applications:', error);
      showToast('error', 'Export Failed', 'Failed to export applications. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleChangeStatus = (applicationId: string, currentStatus: ApplicationStatus) => {
    setStatusChangeModal({ applicationId, currentStatus });
  };

  const handleConfirmStatusChange = async (newStatus: ApplicationStatus, rejectionMessage?: string) => {
    if (!statusChangeModal) return;

    try {
      await applicationService.updateApplicationStatus(statusChangeModal.applicationId, newStatus, rejectionMessage);
      showToast('success', 'Status Updated', `Application status has been changed to ${newStatus}.`);
      setStatusChangeModal(null);
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('error', 'Update Failed', 'Failed to update application status. Please try again.');
      throw error;
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

      {/* Header with Filters */}
      <ApplicationsHeader
        applications={applications}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCreateNew={() => navigate('/applications/create')}
        onExport={() => setShowExportModal(true)}
      />

      {/* Filter Panel */}
      {showFilters && (
        <ApplicationsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
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
            <EmptyState filters={filters} onCreateNew={() => navigate('/applications/create')} />
          ) : (
            <>
              {/* Applications Table */}
              <ApplicationsTable
                applications={applications?.content || []}
                filters={filters}
                onSort={handleSort}
                onPageSizeChange={handlePageSizeChange}
                onView={(id) => navigate(`/applications/${id}`)}
                onEdit={(id) => navigate(`/applications/${id}/edit`)}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onChangeStatus={handleChangeStatus}
              />

              {/* Pagination */}
              {applications && (
                <ApplicationsPagination
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

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
};