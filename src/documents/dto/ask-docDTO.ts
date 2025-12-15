import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AskDocumentDto {
  @ApiProperty({
    description: 'Pergunta para ser feita com  relação a imagem',
    example: 'Qual o valor da fatura?',
  })
  @IsString()
  question: string;
}
