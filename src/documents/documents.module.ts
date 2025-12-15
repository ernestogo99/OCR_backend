import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MinIoModule } from 'src/min-io/min-io.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { OcrService } from 'src/ocr/ocr.service';
import { LlmService } from 'src/llm/llm.service';

@Module({
  imports: [MinIoModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService, OcrService, LlmService],
})
export class DocumentsModule {}
