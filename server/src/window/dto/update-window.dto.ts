import { PartialType } from '@nestjs/mapped-types';
import { CreateWindowDto } from './create-window.dto.js';

export class UpdateWindowDto extends PartialType(CreateWindowDto) {}
