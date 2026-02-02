import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasources: {
    db: {
      url: (() => {
        console.log('DATABASE_URL:', process.env.DATABASE_URL);
        return process.env.DATABASE_URL;
      })(),
    },
  },
});
