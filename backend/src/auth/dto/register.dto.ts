// import { Role } from '@prisma/client';
export enum Role {
  STUDENT = 'STUDENT',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  username!: string;
  password!: string;
  role?: Role;
}
