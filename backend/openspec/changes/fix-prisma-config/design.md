# Design: Fix Prisma Config

## Technical Approach
1. **Environment Loading**: Use `dotenv` to explicitly load `.env` before resolving the configuration, or rely on Prisma's built-in loading if available.
2. **Configuration Structure**: Ensure `datasources.db.url` is set to `process.env.DATABASE_URL`.
3. **Validation**: Add a check to throw an error if `DATABASE_URL` is missing during config initialization.

## Implementation Details
Modify `backend/prisma.config.ts`:
- Check imports.
- Ensure `process.env.DATABASE_URL` is accessed correctly.
- If the function approach is ensuring it runs at runtime, keep it but make sure it returns a string.

```typescript
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```
(Simplifying the IIFE if it's not needed, or keeping it for logging but ensuring it returns string).
