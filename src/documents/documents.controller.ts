import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/currentUser';
import { JwtAuthGuard } from 'src/auth/jwtauthguard';
import { UserResponseDTO } from 'src/users/dto/user-response-dto';
import { docResponseDTO } from './dto/doc-responsedto';
import { AskDocumentDto } from './dto/ask-docDTO';

@Controller('documents')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer Upload de  um arquivo ' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadDocument(
    @UploadedFile() file: File,
    @CurrentUser() user: UserResponseDTO,
  ) {
    return this.documentsService.create(file, user.userId);
  }

  @Get()
  @ApiOkResponse({ type: docResponseDTO })
  @ApiOperation({ summary: 'Obter todos os arquivos do usuário' })
  findAll(@CurrentUser() user: UserResponseDTO) {
    return this.documentsService.findAllByUser(user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: docResponseDTO })
  @ApiOperation({ summary: 'Obter um arquivo específico do usuário' })
  findOne(@Param('id') id: string, @CurrentUser() user: UserResponseDTO) {
    return this.documentsService.findOneByUser(user.userId, id);
  }

  @Post(':id/ask')
  @ApiOperation({
    summary:
      'Endpoint que trata das perguntas relacionadas ao documento, utilizando api do gemini',
  })
  askDocument(
    @Param('id') documentId: string,
    @Body() dto: AskDocumentDto,
    @CurrentUser() user: UserResponseDTO,
  ) {
    return this.documentsService.askDocument(
      user.userId,
      documentId,
      dto.question,
    );
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download do documento com OCR e interações' })
  @ApiOkResponse({
    description: 'Arquivo gerado para download',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async downloadDocument(
    @Param('id') documentId: string,
    @CurrentUser() user: UserResponseDTO,
  ): Promise<StreamableFile> {
    const content = await this.documentsService.getDocumentWithInteractions(
      user.userId,
      documentId,
    );

    const buffer = Buffer.from(content.content, 'utf-8');

    return new StreamableFile(buffer, {
      type: 'text/plain; charset=utf-8',
      disposition: `attachment; filename="document-${documentId}.txt"`,
    });
  }

  @Get(':id/file')
  @ApiOperation({ summary: 'Visualizar ou baixar o arquivo original' })
  @ApiOkResponse({
    description: 'Arquivo do documento',
    schema: { type: 'string', format: 'binary' },
  })
  async getFile(
    @Param('id') documentId: string,
    @CurrentUser() user: UserResponseDTO,
  ): Promise<StreamableFile> {
    return this.documentsService.getFileByUser(user.userId, documentId);
  }
}
