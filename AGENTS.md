# Faktion Kickstarter

Turborepo + pnpm monorepo that new Faktion projects are cloned from.

| Path                    | What                                                        |
| ----------------------- | ----------------------------------------------------------- |
| `apps/client`           | React + Vite (TanStack Router/Query, Apollo, Orval, shadcn) |
| `apps/server`           | NestJS (REST + GraphQL, Prisma, Passport JWT)               |
| `apps/py-api`           | FastAPI (uv, Pydantic settings)                             |
| `packages/database`     | Prisma schema, migrations, seeders (`@repo/database`)       |
| `packages/shared`       | Shared TS types and utils (`@repo/shared`)                  |
| `packages/openapi`      | Zod → OpenAPI converter for Nest Swagger (`@repo/openapi`)  |
| `packages/py-contracts` | Shared Pydantic contract models                             |

Env files: `apps/{client,server,py-api}/.env`, `packages/database/.env`. Ports: client 3000, server 4000, py-api 8000, Postgres 5432.

## Start here

| Topic                                               | Doc                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| Domain concepts and entities                        | [docs/LEXICON.md](docs/LEXICON.md)                                   |
| This project's code conventions                     | [docs/PROJECT_CODE_CONVENTIONS.md](docs/PROJECT_CODE_CONVENTIONS.md) |
| General TypeScript, React and Node code conventions | [docs/GENERAL_CODE_CONVENTIONS.md](docs/GENERAL_CODE_CONVENTIONS.md) |
| Client (React/Vite) patterns                        | [apps/client/AGENTS.md](apps/client/AGENTS.md)                       |
| Server (NestJS) patterns                            | [apps/server/AGENTS.md](apps/server/AGENTS.md)                       |
| py-api (FastAPI) patterns                           | [apps/py-api/AGENTS.md](apps/py-api/AGENTS.md)                       |
| Database (Prisma) patterns                          | [packages/database/AGENTS.md](packages/database/AGENTS.md)           |

Read an app's or package's `AGENTS.md` before editing there.

## Agent-only constraints

- **Follow coding guidance.** Follow the [general](docs/GENERAL_CODE_CONVENTIONS.md) and [project](docs/PROJECT_CODE_CONVENTIONS.md) conventions; project rules take precedence.
- **Ask instead of inventing.** When source data is incomplete, ask rather than inventing enum values or field names.

## Verification

- **Run applicable checks.** Follow [Code generation and verification](docs/PROJECT_CODE_CONVENTIONS.md#code-generation-and-verification).
- **Review added comments.** Check them against the [comment rules](docs/GENERAL_CODE_CONVENTIONS.md#comments) before finishing.
