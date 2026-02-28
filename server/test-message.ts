import { PrismaClient } from '@prisma/client';

try {
  const p = new PrismaClient();
  console.log('OK');
} catch(e: any) {
  console.log('MESSAGE:', e.message);
}
