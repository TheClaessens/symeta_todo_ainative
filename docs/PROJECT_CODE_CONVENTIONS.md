# Project code conventions

Rules specific to this repository. Project-agnostic TypeScript, React and Node guidance lives in
[GENERAL_CODE_CONVENTIONS.md](GENERAL_CODE_CONVENTIONS.md); rules here take precedence over it.
App-specific patterns live in that app's own `AGENTS.md`.

## Type safety

- **Annotate return types.** Give exported and non-trivial functions an explicit return type; ESLint does not enforce it.
- **Keep guards and casts in known places.** Colocate type guards in `*.guards.ts`; keep any unavoidable cast inside one shared util in `packages/shared`, never at call sites.
- **Reuse enums.** Reuse shared and Zod enums; introduce an enum once a string mode or status repeats.
- **Use `type` only where `interface` cannot.** ESLint enforces `interface` for object shapes and props; reserve `type` for unions, primitives and utility-derived aliases.
- **Keep pass-through arrays mutable.** Do not mark an array `readonly` when consumers pass it on to APIs that expect a mutable one.

## Imports

- **Order imports third-party → `@repo/*` → relative.** `simple-import-sort` groups `@repo/*` with third-party packages, so keep the split by hand. Use `@/` aliases inside apps.

## Patterns

- **Coerce truthiness with `!!value`.** Also in JSX conditions (`!!count && <X />`), so a `0` never renders.
- **Write code in English.** Code, comments, identifiers and internal errors are English; user-facing copy lives in the i18n files.

## Environment configuration

- **Read environment variables only through `env`.** Each app parses them once in `src/env.ts` against the Zod schema in `src/env.schema.ts`; add new variables to that schema instead of reading `process.env` or `import.meta.env` elsewhere.

## Code generation and verification

Run `nvm use` (`.nvmrc`) before pnpm or Prisma. Use host pnpm, not Docker, unless asked.

| After changing…                 | Run                                                             |
| ------------------------------- | --------------------------------------------------------------- |
| Prisma schema                   | `packages/database`: `pnpm db:migrate`, then `pnpm db:generate` |
| GraphQL resolvers               | `apps/client`: `pnpm codegen:graphql`                           |
| REST controllers / operationIds | `apps/client`: `pnpm codegen:api`, then fix all hook usages     |
| Anything, before handover       | root: `pnpm lint`, `pnpm format`                                |
