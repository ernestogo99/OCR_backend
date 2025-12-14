import { PartialType } from '@nestjs/swagger';
import { CreateMinIoDto } from './create-min-io.dto';

export class UpdateMinIoDto extends PartialType(CreateMinIoDto) {}
