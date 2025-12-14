import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { File } from 'multer';
import { MinIoService } from 'src/min-io/min-io.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from 'src/users/users.controller';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minIoService: MinIoService,
  ) {}

  async create(file: File, userId: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!userId) {
      throw new BadRequestException('id is required');
    }

    const fileKey = await this.minIoService.upload(file);

    const document = await this.prisma.document.create({
      data: {
        userId,
        fileUrl: fileKey,
        extractedText: '', // OCR virá depois
      },
    });

    return document;
  }

  async findAllByUser(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return documents.map((doc) => ({
      ...doc,
      fileUrl: this.minIoService.getFileUrl(doc.fileUrl),
    }));
  }

  async findOneByUser(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException(`Document not found`);
    }

    return {
      ...document,
      fileUrl: this.minIoService.getFileUrl(document.fileUrl),
    };
  }
  s;
}
