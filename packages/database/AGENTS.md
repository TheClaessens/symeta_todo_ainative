# Database

- `prisma/schema.prisma` is the source of truth; edit it first, then regenerate ([commands](../../docs/PROJECT_CODE_CONVENTIONS.md#code-generation-and-verification)).
- Every `@id` is `@default(uuid(7))`.
- Update `prisma/seed-dev.ts` / `seed-prod.ts` when models change.
