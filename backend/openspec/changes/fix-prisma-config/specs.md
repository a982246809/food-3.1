# Specifications: Fix Prisma Config

## Requirements
1. `prisma db push` must successfully push the schema to the database.
2. The `datasource.url` must be correctly resolved from the environment variable `DATABASE_URL`.
3. The configuration should be robust against missing environment variables (should error clearly if missing).
