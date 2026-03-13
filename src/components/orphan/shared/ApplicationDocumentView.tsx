import React, { useRef, useEffect, useState } from 'react';
import { X, Printer, Download, Maximize2, ChevronDown } from 'lucide-react';
import { OrphanApplication } from '../../../types';
import { Button } from '../../ui/Button';
import { generateApplicationDocumentHTML } from '../../../utils/document';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ApplicationDocumentViewProps {
  application: OrphanApplication;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationDocumentView: React.FC<ApplicationDocumentViewProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const loadDocument = async () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        setLoading(true);
        try {
          const htmlContent = await generateApplicationDocumentHTML(application);

          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(htmlContent);
            iframeDoc.close();
          }
        } catch (error) {
          console.error('Error loading document:', error);
        } finally {
          setLoading(false);
        }
      };

      loadDocument();
    }
  }, [isOpen, application]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handlePrint = async () => {
    const htmlContent = await generateApplicationDocumentHTML(application);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const captureContainer = async (): Promise<HTMLElement | null> => {
    const htmlContent = await generateApplicationDocumentHTML(application);
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);

    await new Promise(resolve => setTimeout(resolve, 100));

    const container = tempDiv.querySelector('.container') as HTMLElement;
    return container;
  };

  const handleDownloadJPG = async () => {
    setShowDownloadMenu(false);
    setLoading(true);
    try {
      const container = await captureContainer();
      if (!container) return;

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = `${application.primaryInformation?.fullName || 'Application'}_Form.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();

      document.body.removeChild(container.parentElement!);
    } catch (error) {
      console.error('Error downloading JPG:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setShowDownloadMenu(false);
    setLoading(true);
    try {
      const container = await captureContainer();
      if (!container) return;

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${application.primaryInformation?.fullName || 'Application'}_Form.pdf`);

      document.body.removeChild(container.parentElement!);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHTML = async () => {
    setShowDownloadMenu(false);
    const htmlContent = await generateApplicationDocumentHTML(application);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${application.primaryInformation?.fullName || 'Application'}_Form.html`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFullscreen = async () => {
    const htmlContent = await generateApplicationDocumentHTML(application);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* Modal Container - Much Larger */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[95vw] h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Document Preview</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <div className="relative" ref={downloadMenuRef}>
              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJPG}
                  className="flex items-center gap-2 rounded-r-none border-r-0"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-md transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleDownloadJPG}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Download as JPG
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Download as PDF
                    </button>
                    <button
                      onClick={handleDownloadHTML}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Download as HTML
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Open in New Tab</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Document Content - Rendered in iframe */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-10">
              <LoadingSpinner message="Loading document with signatures..." />
            </div>
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 bg-white rounded shadow-lg"
            title="Application Document"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};
