import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  datasources: {
    db: {
      url: (() => {
        console.log('DEBUG: DATABASE_URL is', process.env.DATABASE_URL);
        return process.env.DATABASE_URL;
      })(),
    },
  },
});
