import { PartialType } from '@nestjs/mapped-types'; // need to install @nestjs/mapped-types or just use partial definition
import { CreateDishDto } from './create-dish.dto';

// Minimal implementation to avoid extra dependencies if mapped-types not installed
// But typically we install it. I'll just use Partial here for simplicity or install mapped-types.
// I'll define it manually to be safe.
export class UpdateDishDto {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  stock?: number;
  available?: boolean;
}
