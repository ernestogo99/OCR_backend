import { OcrService } from './../ocr/ocr.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { File } from 'multer';
import { OcrStatus } from 'src/generated/prisma/enums';
import { LlmService } from 'src/llm/llm.service';
import { MinIoService } from 'src/min-io/min-io.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minIoService: MinIoService,
    private readonly ocrService: OcrService,
    private readonly geminiService: LlmService,
  ) {}

  async create(file: File, userId: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!userId) {
      throw new BadRequestException('id is required');
    }

    const fileKey = await this.minIoService.upload(file);
    const url = await this.minIoService.getFileUrl(fileKey);

    const document = await this.prisma.document.create({
      data: {
        userId,
        fileUrl: url,
        ocrStatus: OcrStatus.PENDING,
        extractedText: '',
      },
    });

    this.processOcr(document.id, file.buffer);

    return document;
  }

  async askDocument(userId: string, documentId: string, question: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (!document.extractedText) {
      throw new BadRequestException('OCR not finished');
    }

    const MAX_CHARS = 10000;

    const answer = await this.geminiService.askDocument(
      document.extractedText.slice(0, MAX_CHARS),
      question,
    );

    return this.prisma.lLMInteraction.create({
      data: {
        documentId,
        question,
        answer,
      },
    });
  }

  private async processOcr(documentId: string, buffer: Buffer) {
    try {
      await this.prisma.document.update({
        where: { id: documentId },
        data: { ocrStatus: 'PROCESSING' },
      });

      const text = await this.ocrService.extractText(buffer);

      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          extractedText: text,
          ocrStatus: 'DONE',
        },
      });
    } catch (error) {
      console.error('OCR ERROR:', error);

      await this.prisma.document.update({
        where: { id: documentId },
        data: { ocrStatus: 'ERROR' },
      });
    }
  }

  async findAllByUser(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        interactions: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return documents;
  }

  async findOneByUser(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
      include: {
        interactions: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document not found`);
    }

    return document;
  }

  async getDocumentWithInteractions(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
      include: { interactions: true },
    });

    if (!document) {
      throw new NotFoundException();
    }

    const content = `
ID DO DOCUMENTO: ${document.id}
DATA: ${document.createdAt.toISOString()}

========================
TEXTO EXTRAÍDO (OCR)
========================

${document.extractedText}

========================
INTERAÇÕES (LLM)
========================

${
  document.interactions.length === 0
    ? 'Nenhuma interação realizada.'
    : document.interactions
        .map(
          (i, index) => `
${index + 1}) Pergunta:
${i.question}

Resposta:
${i.answer}
`,
        )
        .join('\n')
}
`;

    return { content };
  }
}
