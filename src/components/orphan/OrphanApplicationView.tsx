import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Maximize2, Printer, Download, FileText, Image as ImageIcon, ChevronLeft, AlertTriangle } from 'lucide-react';
import { OrphanApplication, DocumentType, ApplicationStatus } from '../../types';
import { applicationService } from '../../services/applicationService';
import { orphanMediaService } from '../../services/orphanMediaService';
import { documentGenerator } from '../../services/documentGenerator';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { Carousel } from '../ui/Carousel';
import { StatusChangeModal } from './shared/StatusChangeModal';
import { useAuth } from '../../hooks/useAuth';

interface OrphanApplicationViewProps {}

interface DocumentItem {
  type: DocumentType | 'APPLICATION_FORM';
  url?: string;
  name: string;
  isLoading?: boolean;
}

export const OrphanApplicationView: React.FC<OrphanApplicationViewProps> = () => {
  const { id: applicationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<OrphanApplication | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenDoc, setFullscreenDoc] = useState<DocumentItem | null>(null);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { showToast } = useToast();
  const { isAdmin, isAgent, isAuthenticator } = useAuth();

  const canChangeStatus = application && (application.status === 'PENDING' || application.status === 'ACCEPTED') && (isAgent() || isAuthenticator() || isAdmin());

  useEffect(() => {
    loadApplicationData();
  }, [applicationId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenDoc) {
        setFullscreenDoc(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fullscreenDoc]);

  const loadApplicationData = async () => {
    if (!applicationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const appData = await applicationService.getApplication(applicationId);

      // Normalize backend field names to match frontend expectations
      if (appData.basicInformation) {
        const basicInfo = appData.basicInformation as any;

        // Map backend 'resident' to frontend 'isResident'
        if (basicInfo.resident !== undefined && basicInfo.isResident === undefined) {
          basicInfo.isResident = basicInfo.resident;
        }

        // Map backend 'nid' to frontend 'NID'
        if (basicInfo.nid !== undefined && basicInfo.NID === undefined) {
          basicInfo.NID = basicInfo.nid;
        }
      }

      setApplication(appData);

      const applicationFormHtml = await documentGenerator.generateApplicationDocument(appData);
      const blob = new Blob([applicationFormHtml], { type: 'text/html' });
      const applicationFormUrl = URL.createObjectURL(blob);

      const documentUrls = await orphanMediaService.getAllDocumentUrls(applicationId);

      const docs: DocumentItem[] = [
        {
          type: 'APPLICATION_FORM',
          url: applicationFormUrl,
          name: 'Application Form'
        }
      ];

      Object.entries(documentUrls).forEach(([docType, url]) => {
        if (url && url.trim()) {
          docs.push({
            type: docType as DocumentType,
            url: url,
            name: getDocumentName(docType as DocumentType)
          });
        }
      });

      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load application:', error);
      showToast('error', 'Load Failed', 'Failed to load application data.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ApplicationStatus, rejectionMessage?: string) => {
    if (!applicationId) return;

    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus, rejectionMessage);
      await loadApplicationData();
      showToast('success', 'Status Updated', `Application status changed to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('error', 'Status Update Failed', 'Failed to update application status.');
      throw error;
    }
  };

  const getDocumentName = (docType: DocumentType): string => {
    const names: Record<DocumentType, string> = {
      [DocumentType.BIRTH_CERTIFICATE]: 'Birth Certificate',
      [DocumentType.DEATH_CERTIFICATE]: "Father's Death Certificate",
      [DocumentType.NATIONAL_ID]: 'National ID',
      [DocumentType.PASSPORT_IMAGE]: 'Passport Image',
      [DocumentType.FULL_SIZE_IMAGE]: 'Full Size Image',
      [DocumentType.TESTIMONIAL]: 'Testimonial'
    };
    return names[docType] || docType.replace(/_/g, ' ');
  };

  const handleFullscreen = (doc: DocumentItem) => {
    setFullscreenDoc(doc);
  };

  const handlePrint = (doc: DocumentItem) => {
    if (!doc.url) return;

    if (doc.type === 'APPLICATION_FORM') {
      const printWindow = window.open(doc.url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print ${doc.name}</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              <img src="${doc.url}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    if (!doc.url) return;

    try {
      if (doc.type === 'APPLICATION_FORM') {
        const response = await fetch(doc.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${application?.primaryInformation?.fullName || 'Application'}_Form.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const response = await fetch(doc.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const extension = blob.type.split('/')[1] || 'jpg';
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.name}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      showToast('success', 'Downloaded', `${doc.name} has been downloaded.`);
    } catch (error) {
      console.error('Download failed:', error);
      showToast('error', 'Download Failed', 'Failed to download document.');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETE':
      case 'ACCEPTED':
      case 'GRANTED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Application Not Found</h2>
          <Button onClick={() => navigate('/applications')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Carousel />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/applications')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {application.primaryInformation?.fullName}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={getStatusVariant(application.status)}>
                  {application.status.replace('_', ' ')}
                </Badge>
                {canChangeStatus && (
                  <Button
                    variant="primary"
                    onClick={() => setShowStatusModal(true)}
                  >
                    Change Status
                  </Button>
                )}
              </div>
            </div>
          </div>

          {application.status === 'REJECTED' && application.rejectionMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                    Application Rejected
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {application.rejectionMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Application ID</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{application.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Father's Name</p>
                <p className="text-sm text-gray-900 dark:text-white">{application.primaryInformation?.fathersName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {application.primaryInformation?.dateOfBirth ? new Date(application.primaryInformation.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                <p className="text-sm text-gray-900 dark:text-white capitalize">
                  {application.primaryInformation?.gender.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">District</p>
                <p className="text-sm text-gray-900 dark:text-white">{application.address?.permanentDistrict}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Guardian</p>
                <p className="text-sm text-gray-900 dark:text-white">{application.basicInformation?.guardiansName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Documents</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredDoc(doc.name)}
                  onMouseLeave={() => setHoveredDoc(null)}
                >
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-secondary-500 transition-colors">
                    {doc.type === 'APPLICATION_FORM' ? (
                      <div className="aspect-[3/4] flex items-center justify-center">
                        <FileText className="h-24 w-24 text-gray-400 dark:text-gray-500" />
                      </div>
                    ) : (
                      <iframe
                        src={doc.url}
                        className="w-full aspect-[3/4] pointer-events-none"
                        title={doc.name}
                      />
                    )}

                    {hoveredDoc === doc.name && (
                      <div className="absolute top-2 right-2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
                        <button
                          onClick={() => handleFullscreen(doc)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Fullscreen"
                        >
                          <Maximize2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => handlePrint(doc)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Print"
                        >
                          <Printer className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white text-center">
                    {doc.name}
                  </p>
                </div>
              ))}
            </div>

            {documents.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No documents available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {fullscreenDoc && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
            <h3 className="text-white font-medium">{fullscreenDoc.name}</h3>
            <button
              onClick={() => setFullscreenDoc(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="w-full h-full p-8 flex items-center justify-center">
            {fullscreenDoc.type === 'APPLICATION_FORM' ? (
              <iframe
                src={fullscreenDoc.url}
                className="w-full h-full bg-white rounded-lg"
                title={fullscreenDoc.name}
              />
            ) : (
              <img
                src={fullscreenDoc.url}
                alt={fullscreenDoc.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
            Press ESC to exit fullscreen
          </div>
        </div>
      )}

      <StatusChangeModal
        isOpen={showStatusModal && !!application}
        currentStatus={application?.status || ApplicationStatus.PENDING}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusChange}
      />
    </div>
  );
};
