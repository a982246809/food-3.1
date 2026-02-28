import { PrismaClient } from '@prisma/client';

try {
  const p = new PrismaClient();
  p.$connect().then(() => console.log('Connected!')).catch(e => console.error('Connect error:', e));
} catch(e) {
  console.error('Constructor error:', e);
}
