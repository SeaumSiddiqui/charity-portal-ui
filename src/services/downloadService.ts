import { OrphanApplicationSummaryDTO, MedicalDocumentType } from '../types';
import { applicationService } from './applicationService';
import { orphanMediaService } from './orphanMediaService';
import { heartSurgeryMediaService } from './heartSurgeryMediaService';
import { heartSurgeryService } from './medicalApplicationService';
import { DocumentType } from '../types';
import { documentGenerator } from './documentGenerator';
import { generateMedicalApplicationDocumentHTML } from '../utils/document';
import JSZip from 'jszip';

class DownloadServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DownloadServiceError';
  }
}

export const downloadService = {
  async downloadApplicationWithDocuments(application: OrphanApplicationSummaryDTO): Promise<void> {
    try {
      console.log('Starting download for application:', application.id);
      
      // Create folder name: fullname_applicationId
      const folderName = `${application.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_${application.id}`;
      
      // Create ZIP file
      const zip = new JSZip();
      
      // Get full application data
      const fullApplication = await applicationService.getApplication(application.id);
      
      // Generate application document HTML
      const applicationDocumentHtml = documentGenerator.generateApplicationDocument(fullApplication);

      // Add application form to ZIP inside folder
      zip.file(`${folderName}/Application_Form.html`, applicationDocumentHtml);
      
      // Download all supporting documents
      try {
        console.log('Fetching document URLs for application:', application.id);
        const documentUrls = await orphanMediaService.getAllDocumentUrls(application.id);
        console.log('Document URLs received:', documentUrls);
        
        // Download each document that has a URL
        const downloadPromises = Object.entries(documentUrls).map(async ([docType, url]) => {
          if (url && url.trim()) {
            try {
              console.log(`Downloading ${docType} from:`, url);
              const response = await fetch(url);
              if (response.ok) {
                const blob = await response.blob();
                const fileName = this.getDocumentFileName(docType as DocumentType);
                const fileExtension = this.getFileExtension(blob.type);
                const fullFileName = `${folderName}/${fileName}${fileExtension}`;
                console.log(`Adding ${docType} to ZIP as:`, fullFileName);
                zip.file(fullFileName, blob);
              } else {
                console.warn(`Failed to download ${docType}: HTTP ${response.status}`);
              }
            } catch (error) {
              console.error(`Failed to download ${docType}:`, error);
            }
          } else {
            console.log(`No URL available for ${docType}, skipping`);
          }
        });
        
        await Promise.all(downloadPromises);
        console.log('Document download attempts completed');
      } catch (error) {
        console.error('Failed to load documents:', error);
      }
      
      // Generate and download ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      this.downloadBlob(zipBlob, `${folderName}.zip`);
      
      console.log('Download completed for application:', application.id);
    } catch (error) {
      console.error('Download failed:', error);
      throw new DownloadServiceError('Failed to download application documents');
    }
  },

  getDocumentFileName(docType: DocumentType): string {
    const fileNames: Record<DocumentType, string> = {
      [DocumentType.BIRTH_CERTIFICATE]: 'Birth_Certificate',
      [DocumentType.TESTIMONIAL]: 'Testimonial',
      [DocumentType.DEATH_CERTIFICATE]: 'Death_Certificate',
      [DocumentType.NATIONAL_ID]: 'National_ID',
      [DocumentType.PASSPORT_IMAGE]: 'Passport_Image',
      [DocumentType.FULL_SIZE_IMAGE]: 'Full_Size_Image'
    };
    
    return fileNames[docType] || docType;
  },

  getFileExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'application/pdf': '.pdf',
      'text/html': '.html',
      'text/plain': '.txt'
    };
    
    return extensions[mimeType] || '';
  },

  downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async downloadHeartSurgeryApplicationWithDocuments(applicationId: string): Promise<void> {
    try {
      console.log('Starting heart surgery download for application:', applicationId);

      const fullApplication = await heartSurgeryService.getApplication(applicationId);
      const patientName = fullApplication.patientInformation?.fullName || 'Application';
      const folderName = `${patientName.replace(/[^a-zA-Z0-9]/g, '_')}_${applicationId.substring(0, 8)}`;

      const zip = new JSZip();

      const applicationDocumentHtml = await generateMedicalApplicationDocumentHTML(fullApplication);
      zip.file(`${folderName}/Application_Form.html`, applicationDocumentHtml);

      try {
        console.log('Fetching document URLs for application:', applicationId);
        const documentUrls = await heartSurgeryMediaService.getAllDocuments(applicationId);
        console.log('Document URLs received:', documentUrls);

        const downloadPromises = Object.entries(documentUrls).map(async ([docType, url]) => {
          if (url && url.trim()) {
            try {
              console.log(`Downloading ${docType} from:`, url);
              const response = await fetch(url);
              if (response.ok) {
                const blob = await response.blob();
                const fileName = this.getMedicalDocumentFileName(docType as MedicalDocumentType);
                const fileExtension = this.getFileExtension(blob.type);
                const fullFileName = `${folderName}/Documents/${fileName}${fileExtension}`;
                console.log(`Adding ${docType} to ZIP as:`, fullFileName);
                zip.file(fullFileName, blob);
              } else {
                console.warn(`Failed to download ${docType}: HTTP ${response.status}`);
              }
            } catch (error) {
              console.error(`Failed to download ${docType}:`, error);
            }
          }
        });

        await Promise.all(downloadPromises);
      } catch (error) {
        console.error('Failed to load documents:', error);
      }

      try {
        console.log('Fetching reports for application:', applicationId);
        const reports = await heartSurgeryMediaService.getAllReports(applicationId);
        console.log('Reports received:', reports);

        const reportPromises = reports.map(async (report, index) => {
          if (report.url && report.url.trim()) {
            try {
              console.log(`Downloading report ${report.name} from:`, report.url);
              const response = await fetch(report.url);
              if (response.ok) {
                const blob = await response.blob();
                const fileExtension = this.getFileExtension(blob.type);
                const safeName = (report.name || `Report_${index + 1}`).replace(/[^a-zA-Z0-9]/g, '_');
                const fullFileName = `${folderName}/Reports/${safeName}${fileExtension}`;
                console.log(`Adding report to ZIP as:`, fullFileName);
                zip.file(fullFileName, blob);
              } else {
                console.warn(`Failed to download report ${report.name}: HTTP ${response.status}`);
              }
            } catch (error) {
              console.error(`Failed to download report ${report.name}:`, error);
            }
          }
        });

        await Promise.all(reportPromises);
      } catch (error) {
        console.error('Failed to load reports:', error);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      this.downloadBlob(zipBlob, `${folderName}.zip`);

      console.log('Download completed for heart surgery application:', applicationId);
    } catch (error) {
      console.error('Download failed:', error);
      throw new DownloadServiceError('Failed to download application documents');
    }
  },

  getMedicalDocumentFileName(docType: MedicalDocumentType): string {
    const fileNames: Record<MedicalDocumentType, string> = {
      [MedicalDocumentType.APPLICATION_FORM]: 'Application_Form',
      [MedicalDocumentType.BIRTH_CERTIFICATE]: 'Birth_Certificate',
      [MedicalDocumentType.CHAIRMAN_CERTIFICATE]: 'Chairman_Certificate',
      [MedicalDocumentType.FATHERS_NID]: 'Fathers_NID',
      [MedicalDocumentType.MOTHERS_NID]: 'Mothers_NID',
      [MedicalDocumentType.PASSPORT_IMAGE]: 'Passport_Image',
    };

    return fileNames[docType] || docType;
  }
};