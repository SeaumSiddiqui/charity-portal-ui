import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, FileText, Download, Plus, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MedicalDocumentType } from '../../../types';
import { heartSurgeryMediaService, MedicalReport } from '../../../services/heartSurgeryMediaService';
import { Button } from '../../ui/Button';

interface HeartSurgeryMediaModalProps {
  isOpen: boolean;
  applicationId: string;
  onClose: () => void;
}

const DOCUMENT_TYPE_LABELS: Record<MedicalDocumentType, string> = {
  [MedicalDocumentType.APPLICATION_FORM]: 'Application Form',
  [MedicalDocumentType.BIRTH_CERTIFICATE]: 'Birth Certificate',
  [MedicalDocumentType.CHAIRMAN_CERTIFICATE]: 'Chairman Certificate',
  [MedicalDocumentType.FATHERS_NID]: "Father's NID",
  [MedicalDocumentType.MOTHERS_NID]: "Mother's NID",
  [MedicalDocumentType.PASSPORT_IMAGE]: 'Passport Image',
};

export const HeartSurgeryMediaModal: React.FC<HeartSurgeryMediaModalProps> = ({
  isOpen,
  applicationId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'reports'>('documents');
  const [documents, setDocuments] = useState<Record<MedicalDocumentType, string>>({} as Record<MedicalDocumentType, string>);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newReportName, setNewReportName] = useState('');
  const [showNewReportInput, setShowNewReportInput] = useState(false);

  const documentInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const reportInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && applicationId) {
      loadMedia();
    }
  }, [isOpen, applicationId]);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsData, reportsData] = await Promise.all([
        heartSurgeryMediaService.getAllDocuments(applicationId),
        heartSurgeryMediaService.getAllReports(applicationId),
      ]);
      setDocuments(docsData || {});
      setReports(reportsData || []);
    } catch (err: any) {
      console.error('Error loading media:', err);
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (docType: MedicalDocumentType, file: File) => {
    setUploading(docType);
    setError(null);
    try {
      await heartSurgeryMediaService.uploadDocument(applicationId, docType, file);
      const updatedDocs = await heartSurgeryMediaService.getAllDocuments(applicationId);
      setDocuments(updatedDocs || {});
    } catch (err: any) {
      console.error('Error uploading document:', err);
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const handleReportUpload = async (file: File) => {
    if (!newReportName.trim()) {
      setError('Please enter a report name');
      return;
    }
    setUploading('report');
    setError(null);
    try {
      await heartSurgeryMediaService.uploadReport(applicationId, file, newReportName.trim());
      const updatedReports = await heartSurgeryMediaService.getAllReports(applicationId);
      setReports(updatedReports || []);
      setNewReportName('');
      setShowNewReportInput(false);
    } catch (err: any) {
      console.error('Error uploading report:', err);
      setError(err.message || 'Failed to upload report');
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    setDeleting(reportId);
    setError(null);
    try {
      await heartSurgeryMediaService.deleteReport(applicationId, reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err: any) {
      console.error('Error deleting report:', err);
      setError(err.message || 'Failed to delete report');
    } finally {
      setDeleting(null);
    }
  };

  const triggerDocumentUpload = (docType: MedicalDocumentType) => {
    documentInputRefs.current[docType]?.click();
  };

  const triggerReportUpload = () => {
    if (!newReportName.trim()) {
      setError('Please enter a report name first');
      return;
    }
    reportInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Manage Documents & Reports
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : activeTab === 'documents' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(MedicalDocumentType).map((docType) => {
                const hasDocument = !!documents[docType];
                const isUploading = uploading === docType;

                return (
                  <div
                    key={docType}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {hasDocument ? (
                          <ImageIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {DOCUMENT_TYPE_LABELS[docType]}
                        </span>
                      </div>
                      {hasDocument && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                          Uploaded
                        </span>
                      )}
                    </div>

                    {hasDocument && (
                      <div className="mb-3">
                        <a
                          href={documents[docType]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          View Document
                        </a>
                      </div>
                    )}

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
                      onClick={() => triggerDocumentUpload(docType)}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {hasDocument ? 'Replace' : 'Upload'}
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <div className="mb-6">
                {showNewReportInput ? (
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
                      onClick={triggerReportUpload}
                      disabled={uploading === 'report' || !newReportName.trim()}
                    >
                      {uploading === 'report' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewReportInput(false);
                        setNewReportName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setShowNewReportInput(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Report
                  </Button>
                )}
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reports uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {report.name}
                          </div>
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            View Report
                          </a>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        disabled={deleting === report.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        {deleting === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
