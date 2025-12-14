import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/currentUser';
import { JwtAuthGuard } from 'src/auth/jwtauthguard';
import { UserResponseDTO } from 'src/users/dto/user-response-dto';

@Controller('documents')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
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
  findAll(@CurrentUser() user: UserResponseDTO) {
    return this.documentsService.findAllByUser(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserResponseDTO) {
    return this.documentsService.findOneByUser(user.userId, id);
  }
}
