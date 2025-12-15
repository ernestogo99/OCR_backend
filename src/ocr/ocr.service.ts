import { Injectable } from '@nestjs/common';
import { recognize } from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractText(buffer: Buffer): Promise<string> {
    const { data } = await recognize(buffer, 'eng', {
      logger: (m) => console.log('[OCR]', m.status),
    });

    return data.text;
  }
}
