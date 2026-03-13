import { generateApplicationDocumentHTML } from '../utils/document';
import { OrphanApplication } from '../types';

export const documentGenerator = {
  async generateApplicationDocument(application: OrphanApplication): Promise<string> {
    return await generateApplicationDocumentHTML(application);
  }
};
