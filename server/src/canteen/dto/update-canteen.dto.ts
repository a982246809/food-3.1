import { PartialType } from '@nestjs/mapped-types';
import { CreateCanteenDto } from './create-canteen.dto.js';

export class UpdateCanteenDto extends PartialType(CreateCanteenDto) {}
