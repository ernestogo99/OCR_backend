import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MinIoModule } from 'src/min-io/min-io.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [MinIoModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService],
})
export class DocumentsModule {}
