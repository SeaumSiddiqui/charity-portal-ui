import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard as Edit,
  User,
  Users,
  Heart,
  FileText,
  Image as ImageIcon,
  Download,
  Printer,
  Maximize2,
  X,
  Upload,
  Trash2,
  Plus,
  Loader2,
  ExternalLink,
  AlertCircle,
  Home,
  Phone,
} from 'lucide-react';
import {
  MedicalApplication,
  MedicalDocumentType,
  ApplicationStatus,
  PatientRelation,
} from '../../../types';
import { heartSurgeryService } from '../../../services/medicalApplicationService';
import { heartSurgeryMediaService, MedicalReport } from '../../../services/heartSurgeryMediaService';
import { generateMedicalApplicationDocumentHTML } from '../../../utils/document';
import { useToast } from '../../ui/Toast';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { Button } from '../../ui/Button';
import { Carousel } from '../../ui/Carousel';
import { MedicalStatusBadge } from '../shared/MedicalStatusBadge';
import { StatusChangeModal } from '../../orphan/shared/StatusChangeModal';
import { useAuth } from '../../../hooks/useAuth';

interface DocumentItem {
  type: MedicalDocumentType | 'APPLICATION_FORM';
  url?: string;
  name: string;
}

const DOCUMENT_TYPE_LABELS: Record<MedicalDocumentType, string> = {
  [MedicalDocumentType.APPLICATION_FORM]: 'Application Form',
  [MedicalDocumentType.BIRTH_CERTIFICATE]: 'Birth Certificate',
  [MedicalDocumentType.CHAIRMAN_CERTIFICATE]: 'Chairman Certificate',
  [MedicalDocumentType.FATHERS_NID]: "Father's NID",
  [MedicalDocumentType.MOTHERS_NID]: "Mother's NID",
  [MedicalDocumentType.PASSPORT_IMAGE]: 'Passport Image',
};

const REQUIRED_DOCUMENTS: MedicalDocumentType[] = [
  MedicalDocumentType.BIRTH_CERTIFICATE,
  MedicalDocumentType.CHAIRMAN_CERTIFICATE,
  MedicalDocumentType.FATHERS_NID,
  MedicalDocumentType.MOTHERS_NID,
  MedicalDocumentType.PASSPORT_IMAGE,
];

export const HeartSurgeryApplicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAdmin, isAgent } = useAuth();
  const [application, setApplication] = useState<MedicalApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [fullscreenDoc, setFullscreenDoc] = useState<DocumentItem | MedicalReport | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showNewReportInput, setShowNewReportInput] = useState(false);
  const [newReportName, setNewReportName] = useState('');

  const documentInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const reportInputRef = useRef<HTMLInputElement>(null);

  const canManageMedia = application?.status === ApplicationStatus.COMPLETE && (isAdmin() || isAgent());

  useEffect(() => {
    loadApplicationData();
  }, [id]);

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
    if (!id) return;

    try {
      setLoading(true);
      const data = await heartSurgeryService.getApplication(id);
      setApplication(data);

      let passportImageUrl: string | undefined;
      let documentUrls: Record<string, string> = {};

      try {
        documentUrls = await heartSurgeryMediaService.getAllDocuments(id);
        passportImageUrl = documentUrls[MedicalDocumentType.PASSPORT_IMAGE];
      } catch (err) {
        console.log('No documents found or error loading documents');
      }

      const applicationFormHtml = await generateMedicalApplicationDocumentHTML(data, passportImageUrl);
      const blob = new Blob([applicationFormHtml], { type: 'text/html' });
      const applicationFormUrl = URL.createObjectURL(blob);

      const docs: DocumentItem[] = [
        {
          type: 'APPLICATION_FORM',
          url: applicationFormUrl,
          name: 'Application Form',
        },
      ];

      Object.entries(documentUrls).forEach(([docType, url]) => {
        if (url && url.trim()) {
          docs.push({
            type: docType as MedicalDocumentType,
            url: url,
            name: DOCUMENT_TYPE_LABELS[docType as MedicalDocumentType] || docType,
          });
        }
      });

      setDocuments(docs);

      try {
        const reportsData = await heartSurgeryMediaService.getAllReports(id);
        setReports(reportsData || []);
      } catch (err) {
        console.log('No reports found or error loading reports');
      }
    } catch (error: any) {
      console.error('Error fetching application:', error);
      showToast('error', 'Load Failed', error.message || 'Failed to load the application.');
      navigate('/medical/heart-surgery');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string, rejectionMessage?: string) => {
    if (!id) return;

    try {
      const updatedApplication = await heartSurgeryService.updateApplicationStatus(
        id,
        newStatus,
        rejectionMessage
      );
      setApplication(updatedApplication);
      setShowStatusModal(false);
      showToast('success', 'Status Updated', `Application status changed to ${newStatus}.`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      showToast('error', 'Status Update Failed', error.message || 'Failed to update the status.');
    }
  };

  const checkAndUpdateStatusToPending = async (currentDocUrls: Record<string, string>) => {
    if (!id || !application || application.status !== ApplicationStatus.COMPLETE) return;

    const allRequiredUploaded = REQUIRED_DOCUMENTS.every(
      (docType) => currentDocUrls[docType] && currentDocUrls[docType].trim() !== ''
    );

    if (allRequiredUploaded) {
      try {
        const updatedApp = await heartSurgeryService.updateApplicationStatus(id, 'PENDING');
        setApplication(updatedApp);
        showToast('success', 'Status Updated', 'All required documents uploaded. Application status changed to PENDING.');
      } catch (err: any) {
        console.error('Failed to update status to PENDING:', err);
        showToast('error', 'Status Update Failed', 'Documents uploaded but failed to update status to PENDING.');
      }
    }
  };

  const handleDocumentUpload = async (docType: MedicalDocumentType, file: File) => {
    if (!id) return;
    setUploading(docType);
    try {
      await heartSurgeryMediaService.uploadDocument(id, docType, file);

      const updatedDocUrls = await heartSurgeryMediaService.getAllDocuments(id);
      await checkAndUpdateStatusToPending(updatedDocUrls);
      await loadApplicationData();

      showToast('success', 'Uploaded', `${DOCUMENT_TYPE_LABELS[docType]} uploaded successfully.`);
    } catch (err: any) {
      showToast('error', 'Upload Failed', err.message || 'Failed to upload document.');
    } finally {
      setUploading(null);
    }
  };

  const handleReportUpload = async (file: File) => {
    if (!id || !newReportName.trim()) return;
    setUploading('report');
    try {
      await heartSurgeryMediaService.uploadReport(id, file, newReportName.trim());
      await loadApplicationData();
      setNewReportName('');
      setShowNewReportInput(false);
      showToast('success', 'Uploaded', 'Report uploaded successfully.');
    } catch (err: any) {
      showToast('error', 'Upload Failed', err.message || 'Failed to upload report.');
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!id) return;
    setDeleting(reportId);
    try {
      await heartSurgeryMediaService.deleteReport(id, reportId);
      setReports(reports.filter((r) => r.id !== reportId));
      showToast('success', 'Deleted', 'Report deleted successfully.');
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message || 'Failed to delete report.');
    } finally {
      setDeleting(null);
    }
  };

  const handleFullscreen = (item: DocumentItem | MedicalReport) => {
    setFullscreenDoc(item);
  };

  const handlePrint = (item: DocumentItem | MedicalReport) => {
    const url = 'url' in item ? item.url : undefined;
    if (!url) return;

    const isApplicationForm = 'type' in item && item.type === 'APPLICATION_FORM';

    if (isApplicationForm) {
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => printWindow.print();
      }
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Print Document</title>
            <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh}img{max-width:100%;height:auto}</style>
            </head>
            <body><img src="${url}" onload="window.print(); window.close();" /></body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownload = async (item: DocumentItem | MedicalReport) => {
    const url = 'url' in item ? item.url : undefined;
    const name = item.name;
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const isHtml = 'type' in item && item.type === 'APPLICATION_FORM';
      a.download = isHtml ? `${name}.html` : `${name}.${blob.type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      showToast('success', 'Downloaded', `${name} has been downloaded.`);
    } catch (error) {
      showToast('error', 'Download Failed', 'Failed to download document.');
    }
  };

  const handleOpenInNewTab = (url?: string) => {
    if (url) window.open(url, '_blank');
  };

  if (loading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested application could not be found.
          </p>
        </div>
      </div>
    );
  }

  const patient = application.patientInformation;
  const address = application.patientAddress;
  const contact = application.contactInformation;
  const familyMembers = application.patientFamilyMembers || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Carousel />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/medical/heart-surgery')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-teal-500" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Heart Surgery Application
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Application ID: {application.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MedicalStatusBadge status={application.status} />
              <Button
                variant="outline"
                onClick={() => navigate(`/medical/heart-surgery/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowStatusModal(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Change Status
              </Button>
            </div>
          </div>

          {application.status === ApplicationStatus.REJECTED && application.rejectionMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                    Rejection Reason
                  </h3>
                  <p className="text-red-700 dark:text-red-300">{application.rejectionMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Patient Information
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Code</label>
                    <p className="mt-1 text-gray-900 dark:text-white font-medium">{patient?.code || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                    <p className="mt-1 text-gray-900 dark:text-white font-medium">{patient?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">BC Registration</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.bcRegistration || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.dateOfBirth || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
                    <p className="mt-1 text-gray-900 dark:text-white capitalize">{patient?.gender?.toLowerCase() || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Father's Name</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.fathersName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Father's Profession</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.fathesProfession || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Mother's Name</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.mothersName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Mother's Profession</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.mothersProfession || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Annual Income</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.annualIncome || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Family Member Count</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{patient?.familyMemberCount || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <Home className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Permanent Address</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">Village: </span>
                        {address?.permanentVillage || 'N/A'}
                      </p>
                      {address?.permanentArea && (
                        <p className="text-gray-900 dark:text-white">
                          <span className="text-gray-500 dark:text-gray-400">Area: </span>
                          {address.permanentArea}
                        </p>
                      )}
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">Union: </span>
                        {address?.permanentUnion || 'N/A'}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">Sub-District: </span>
                        {address?.permanentSubDistrict || 'N/A'}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">District: </span>
                        {address?.permanentDistrict || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Present Address
                      {address?.isSameAsPermanent && (
                        <span className="ml-2 text-xs text-teal-600 dark:text-teal-400 font-normal">(Same as Permanent)</span>
                      )}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">Village: </span>
                        {address?.presentVillage || 'N/A'}
                      </p>
                      {address?.presentArea && (
                        <p className="text-gray-900 dark:text-white">
                          <span className="text-gray-500 dark:text-gray-400">Area: </span>
                          {address.presentArea}
                        </p>
                      )}
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">Union: </span>
                        {address?.presentUnion || 'N/A'}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">Sub-District: </span>
                        {address?.presentSubDistrict || 'N/A'}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-gray-500 dark:text-gray-400">District: </span>
                        {address?.presentDistrict || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <Home className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Household Information</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">House Status</label>
                    <p className="mt-1 text-gray-900 dark:text-white capitalize">
                      {application.householdInformation?.houseStatus?.toLowerCase().replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">House Type</label>
                    <p className="mt-1 text-gray-900 dark:text-white capitalize">
                      {application.householdInformation?.houseType?.toLowerCase().replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Number of Rooms</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{application.householdInformation?.numOfRooms || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">House Size</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{application.householdInformation?.houseSize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Plot Size</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{application.householdInformation?.plotSize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Land Size</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{application.householdInformation?.landSize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Has Tube Well</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{application.householdInformation?.hasTubeWell ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Has Latrine</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{application.householdInformation?.hasLatrine ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contact?.relativeContacts && Object.entries(contact.relativeContacts).map(([relation, phone]) => (
                    phone && (
                      <div key={relation}>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                          {relation.toLowerCase().replace('_', ' ')} Contact
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {phone}
                        </p>
                      </div>
                    )
                  ))}
                  {contact?.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <p className="mt-1 text-gray-900 dark:text-white">{contact.email}</p>
                    </div>
                  )}
                </div>
                {contact?.additionalComment && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Additional Comments</label>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{contact.additionalComment}</p>
                  </div>
                )}
                {(!contact?.relativeContacts || Object.keys(contact.relativeContacts).length === 0) && !contact?.email && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No contact information provided</p>
                )}
              </div>
            </div>

            {familyMembers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Family Members</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{familyMembers.length} member{familyMembers.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {familyMembers.map((member, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Name:</span>
                            <p className="text-gray-900 dark:text-white">{member.name || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Age:</span>
                            <p className="text-gray-900 dark:text-white">{member.age ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Marital Status:</span>
                            <p className="text-gray-900 dark:text-white">{member.maritalStatus || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Grade:</span>
                            <p className="text-gray-900 dark:text-white">{member.grade ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Occupation:</span>
                            <p className="text-gray-900 dark:text-white">{member.occupation || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="relative group"
                      onMouseEnter={() => setHoveredItem(doc.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400 transition-colors">
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

                        {hoveredItem === doc.name && (
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
                      <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white text-center">{doc.name}</p>
                      {canManageMedia && doc.type !== 'APPLICATION_FORM' && (
                        <div className="mt-2">
                          <input
                            type="file"
                            ref={(el) => { documentInputRefs.current[doc.type] = el; }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleDocumentUpload(doc.type as MedicalDocumentType, file);
                              e.target.value = '';
                            }}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => documentInputRefs.current[doc.type]?.click()}
                            disabled={uploading === doc.type}
                            className="w-full"
                          >
                            {uploading === doc.type ? (
                              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
                            ) : (
                              <><Upload className="h-4 w-4 mr-2" />Replace</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {canManageMedia && Object.values(MedicalDocumentType).filter(
                    (type) => !documents.some((d) => d.type === type)
                  ).map((docType) => (
                    <div key={docType} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        {DOCUMENT_TYPE_LABELS[docType]}
                      </p>
                      <input
                        type="file"
                        ref={(el) => { documentInputRefs.current[docType] = el; }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(docType, file);
                          e.target.value = '';
                        }}
                        accept="image/*,.pdf"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => documentInputRefs.current[docType]?.click()}
                        disabled={uploading === docType}
                      >
                        {uploading === docType ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
                        ) : (
                          <><Upload className="h-4 w-4 mr-2" />Upload</>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                {documents.length === 0 && !canManageMedia && (
                  <div className="text-center py-12">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No documents available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Reports</h2>
                  </div>
                  {canManageMedia && !showNewReportInput && (
                    <Button onClick={() => setShowNewReportInput(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Report
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-6">
                {showNewReportInput && canManageMedia && (
                  <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Report Name
                        </label>
                        <input
                          type="text"
                          value={newReportName}
                          onChange={(e) => setNewReportName(e.target.value)}
                          placeholder="Enter report name"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="file"
                        ref={reportInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReportUpload(file);
                          e.target.value = '';
                        }}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                      />
                      <Button
                        onClick={() => newReportName.trim() && reportInputRef.current?.click()}
                        disabled={uploading === 'report' || !newReportName.trim()}
                      >
                        {uploading === 'report' ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
                        ) : (
                          <><Upload className="h-4 w-4 mr-2" />Upload</>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => { setShowNewReportInput(false); setNewReportName(''); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {reports.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No medical reports uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{report.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFullscreen(report)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Fullscreen"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenInNewTab(report.url)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(report)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {canManageMedia && (
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              disabled={deleting === report.id}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              {deleting === report.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
            {'type' in fullscreenDoc && fullscreenDoc.type === 'APPLICATION_FORM' ? (
              <iframe
                src={fullscreenDoc.url}
                className="w-full h-full bg-white rounded-lg"
                title={fullscreenDoc.name}
              />
            ) : (
              <img
                src={'url' in fullscreenDoc ? fullscreenDoc.url : ''}
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
        isOpen={showStatusModal}
        currentStatus={application.status}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
