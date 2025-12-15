import { OcrStatus } from 'src/generated/prisma/enums';

export class docResponseDTO {
  id: string;
  userId: string;
  fileUrl: string;
  extractedText: string;
  ocrStatus: OcrStatus;
  createdAt: string;
}
