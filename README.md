# Faktion Kickstarter

This repository is a template based on **[faktion-guidelines](https://github.com/faktionbe/faktion-guidelines)**.
For new projects, this repository should be forked/cloned and follow its code guidelines & standards.

Read carefully through **[faktion-guidelines](https://github.com/faktionbe/faktion-guidelines)**

- **🌐 Frontend**: React + Vite + TanStack Router + Tailwind CSS + ShadCN UI
- **⚡ Backend**: NestJS + GraphQL + REST APIs + PostgreSQL + Prisma
- **🐍 Python**: FastAPI backend for agents, integrations & ML tasks
- **📦 Monorepo**: Unified development with Turborepo + pnpm workspaces
- **🔧 Dev Tools**: ESLint, Prettier, TypeScript, Hot reload across all apps

> **🎯 TL;DR**: Just run `bash ./scripts/kickstart.sh` and you're ready to go! Everything is automated.

## Prerequisites

**The kickstart script handles most setup automatically!** You only need to install these manually:

- **Python** - Required for FastAPI backend ([Download](https://www.python.org/downloads/))
- **Docker** - Our database runs inside docker
- **curl** - You need `curl` (usually pre-installed) for the Node.js setup via nvm

### What Kickstart Installs For You:

✅ **Node.js** - Installs via nvm automatically  
✅ **pnpm** - Installs globally  
✅ **pre-commit** - Installs globally using brew  
✅ **Python dependencies** - Creates virtual environment and installs packages  
✅ **Node.js dependencies** - Runs `pnpm install` for all apps

## ⚡ One-Command Setup

**The kickstart script does everything for you!** No complex setup required.

```bash
git clone <your-repo>
cd faktion-kickstarter
bash ./scripts/kickstart.sh      # 🎯 This sets up EVERYTHING automatically
pnpm build                       # Build packages first and verify setup
pnpm dev                         # Start developing immediately
```

### What `pnpm kickstart` Does For You:

✅ **Installs Node.js & pnpm** (via nvm)  
✅ **Installs Python dependencies** (creates virtual environment)  
✅ **Installs all Node.js packages** (runs `pnpm install`)  
✅ **Validates your setup** and reports any issues

### What You'll Need To Do After Kickstart:

📝 **Setup environment files** (copy from examples if they exist)  
🗄️ **Run database migrations** (`cd packages/database && pnpm db:migrate`)  
🔧 **Generate code** (GraphQL types, API clients)

### Manual Configuration (Required)

After kickstart, you need to:

```bash
# Create and configure environment files
cp apps/client/.env.example apps/client/.env          # If exists
cp apps/server/.env.example apps/server/.env          # If exists
cp apps/py-api/.env.example apps/py-api/.env          # If exists
cp packages/database/.env.example packages/database/.env  # If exists

# Edit the .env files with your database URLs and API keys
```

Your applications will be running at:

- 🌐 **Frontend (React)**: http://localhost:3000
- ⚡ **Backend (NestJS)**: http://localhost:4000
  - GraphQL Playground: http://localhost:4000/graphql
  - Swagger API Docs: http://localhost:4000/api
- 🐍 **Python (FastAPI)**: http://localhost:8000
  - FastAPI Docs: http://localhost:8000/docs
  - ReDoc: http://localhost:8000/redoc

## 🏗️ Architecture

This monorepo implements a **dual-stack architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Faktion Kickstarter                      │
│                  (Turborepo Monorepo)                       │
├─────────────────────┬───────────────────────────────────────┤
│   SOFTWARE STACK    │           PYTHON BACKEND              │
│    (TypeScript)     │            (FastAPI)                  │
├─────────────────────┼───────────────────────────────────────┤
│                     │                                       │
│ ┌─────────────────┐ │ ┌───────────────────────────────────┐ │
│ │  React Client   │ │ │         FastAPI App               │ │
│ │  (Vite/TS)      │ │ │         (Python)                   │ │
│ └─────────────────┘ │ │                                   │ │
│                     │ │  • Agents & Integrations          │ │
│ ┌─────────────────┐ │ │  • Background Tasks               │ │
│ │  NestJS Server  │◄┼─┤  • ML/AI APIs                     │ │
│ │  (GraphQL/REST) │ │ │  • Data Processing                │ │
│ └─────────────────┘ │ └───────────────────────────────────┘ │
│                     │                                       │
│ ┌─────────────────┐ │                                       │
│ │ Shared Packages │ │                                       │
│ │ • Database      │ │                                       │
│ │ • Logger        │ │                                       │
│ │ • Types/Utils   │ │                                       │
│ └─────────────────┘ │                                       │
└─────────────────────┴───────────────────────────────────────┘
```

## 📁 Project Structure

```
faktion-kickstarter/
├── apps/
│   ├── client/                 # React Frontend App
│   │   ├── src/
│   │   │   ├── components/ui/  # ShadCN UI components
│   │   │   ├── routes/         # File-based routing (TanStack Router)
│   │   │   ├── api/            # Generated API clients
│   │   │   ├── providers/      # React context providers
│   │   │   └── hooks/          # Custom React hooks
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── server/                 # NestJS Backend API
│   │   ├── src/modules/
│   │   │   ├── auth/           # JWT authentication
│   │   │   ├── common/         # Shared decorators, pipes
│   │   │   ├── prisma/         # Prisma service
│   │   │   └── data-loader/    # GraphQL optimization
│   │   ├── package.json
│   │   └── nest-cli.json
│   │
│   └── py-api/                 # FastAPI Python Backend
│       ├── src/
│       │   ├── faktion_ml_api
│       │   │   └── app
│       │   │       ├── config
│       │   │       │   ├── logging.py # Logging configuration
│       │   │       │   ├── logging.yaml
│       │   │       │   └── settings.py # Settings configuration
│       │   │       ├── exceptions.py # Exceptions
│       │   │       ├── main.py # Main application
│       │   │       └── routers
│       │   │           ├── __init__.py # Router initialization
│       │   │           ├── health.py # Health check router
│       │   │           └── root.py # Root router
│       ├── pyproject.toml      # Python dependencies
│       └── package.json        # npm scripts for Turborepo
│       └── tests/              # Python tests
│
├── packages/
│   ├── database/               # Shared Database Package
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Database migrations
│   │   └── src/                # Prisma client exports
│   │
│   ├── logger/                 # Shared Logging Package
│   │   └── src/                # Logger configuration
│   │
│   └── shared/                 # Shared Utilities & Types
│       └── src/
│           ├── types/          # Common TypeScript types
│           └── utils/          # Shared utility functions
│
├── scripts/                    # Setup and utility scripts
├── package.json               # Root package.json
├── turbo.json                 # Turborepo configuration
└── pnpm-workspace.yaml        # pnpm workspaces config
```

## 🎯 Applications Deep Dive

### 🌐 Frontend (apps/client/)

**React + Vite application** with modern tooling:

- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and builds
- **Routing**: TanStack Router (file-based routing)
- **State Management**: TanStack Query (React Query)
- **GraphQL**: Apollo Client with automatic code generation
- **REST APIs**: Axios + Orval for OpenAPI client generation
- **UI Framework**: Tailwind CSS + ShadCN UI components
- **Forms**: React Hook Form + Zod validation
- **i18n**: i18next for internationalization

**Key Files**:

- `src/routes/` - File-based routing structure
- `src/components/ui/` - Reusable UI components
- `src/api/` - Auto-generated API clients
- `src/providers/` - React context providers
- `codegen.ts` - GraphQL code generation config
- `orval.config.ts` - REST API client generation

### ⚡ Backend (apps/server/)

**NestJS application** with full-featured API:

- **Framework**: NestJS (Express-based)
- **APIs**: REST (Swagger) + GraphQL (Apollo Server)
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: JWT + Passport (Local & JWT strategies)
- **Password Security**: Argon2 hashing
- **Validation**: Zod 4 + Nest Standard Schema (`@repo/openapi` for OpenAPI)
- **Data Loading**: DataLoader for GraphQL N+1 prevention
- **Build**: SWC compiler for faster builds

**Key Features**:

- JWT-based authentication with refresh tokens
- GraphQL API with automatic schema generation
- REST API with Swagger documentation
- Database migrations and seeding
- Role-based access control
- Request/response validation

**Key Files**:

- `src/modules/auth/` - Authentication logic
- `src/modules/common/` - Shared decorators, guards, pipes
- `src/modules/prisma/` - Database service integration

### 🐍 Python Backend (apps/python/)

**FastAPI application** for extensible backend services:

- **Framework**: FastAPI with async/await support
- **Language**: Python with modern type hints
- **Package Manager**: uv for ultra-fast dependency management
- **Code Quality**: Ruff (linting + formatting) + MyPy (type checking)
- **Testing**: pytest with async support
- **Server**: Uvicorn ASGI server
- **Integration**: Turborepo-compatible npm scripts

**Use Cases**:

- AI agents and chatbot integrations
- Third-party API integrations
- Background task processing
- ML model serving and inference
- Data processing and analytics
- Heavy computational workloads

**Key Files**:

- `app/main.py` - FastAPI application setup
- `app/routers/` - API route handlers
- `app/settings.py` - Environment configuration
- `tests/` - Python test suite
- `pyproject.toml` - Python dependencies and tooling

## 📦 Shared Packages

Build by tsup, all packages live under `packages/` and are referenced using `@repo/package`. The `@repo/` prefix is necessary to differentiate packages on npm/... and local.

## 🛠️ Development Commands

### Root Level Commands

```bash
# Development
pnpm dev              # Start all apps (React + NestJS + FastAPI)
pnpm dev:sw           # Start only TypeScript apps (React + NestJS)
pnpm dev:ml           # Start only Python backend (FastAPI)

# Building
pnpm build            # Build all TypeScript packages

# Code Quality
pnpm lint             # Run linting across all apps
pnpm format           # Format code across all apps

# Setup
pnpm kickstart        # Initial project setup
pnpm install          # Install all dependencies
```

### Git Worktrees

Use `scripts/git-wt.sh` to create a branch in a sibling worktree, copy the
repository's local `.env` files, and open the worktree in your selected tool.
VS Code is used by default.

```bash
./scripts/git-wt.sh feature/my-change
./scripts/git-wt.sh --ide=cursor feature/my-change
./scripts/git-wt.sh --ide=pycharm feature/my-change origin/main
./scripts/git-wt.sh --ide=none feature/my-change
```

Use `--ide=<ide>` to select an IDE. Set `GIT_WT_IDE` to change the default for
your shell.

| IDE value | Tool launched |
| --- | --- |
| `vscode` (default) | Visual Studio Code |
| `cursor` | Cursor |
| `webstorm` | WebStorm |
| `pycharm` | PyCharm |
| `none` | Nothing |

Environment files under `apps/` and `packages/` are copied for every IDE
selection. IDE configuration is not copied; commit shared configuration so Git
checks it out in every worktree. The optional `base-ref` is only used when
creating a new branch; it defaults to the currently checked-out commit.

### App-Specific Commands

```bash
# Frontend (apps/client/)
cd apps/client
pnpm dev              # Start Vite dev server
pnpm build            # Build for production
pnpm codegen:graphql  # Generate GraphQL types
pnpm codegen:api      # Generate REST API client

# Backend (apps/server/)
cd apps/server
pnpm dev              # Start NestJS with hot reload
pnpm build            # Build for production
pnpm test             # Run Vitest tests
pnpm test:e2e         # Run end-to-end tests

# Python Backend (apps/python/)
cd apps/python
npm run dev           # Start FastAPI with hot reload
npm run build         # No-op (FastAPI doesn't need building)
npm run test          # Run pytest tests
npm run lint          # Run Ruff linting
npm run format        # Format with Ruff
npm run type-check    # Run MyPy type checking
```

### Database Commands

```bash
cd packages/database
pnpm db:migrate       # Apply database migrations
pnpm db:generate      # Generate Prisma client
pnpm db:deploy        # Deploy migrations (production)
pnpm seed-dev         # Seed development data
pnpm seed-prod        # Seed production data
```

## 🔄 Inter-Stack Communication

The stacks communicate through several mechanisms:

1. **HTTP APIs**:
   - FastAPI exposes REST endpoints
   - NestJS can consume these endpoints
   - Frontend calls both NestJS and FastAPI directly

2. **Shared Database**:
   - Both TypeScript and Python can access PostgreSQL
   - Use proper data contracts and migrations
   - Prisma generates types for TypeScript side

3. **Message Queues** (Future):
   - For async background job processing
   - Can be implemented with Redis/Bull for heavy tasks

4. **File System**:
   - Shared configuration files
   - Data files and model artifacts
   - Log files and temporary storage

## 🎯 When to Use Each Stack

### Use TypeScript Stack For:

- 🖥️ User interfaces and admin dashboards
- 🔐 Authentication and user management
- 📊 Business logic and CRUD operations
- 🔗 Real-time features (WebSockets)
- 📈 Data visualization and reports
- 🛡️ Traditional web application features

### Use Python Backend For:

- 🤖 AI agents and chatbot integrations
- 🔗 Third-party API integrations (Slack, Discord, etc.)
- ⚙️ Background tasks and job processing
- 🧠 ML model serving and inference
- 📊 Data processing and analytics
- 💪 Heavy computational tasks
- 🐍 Python-specific libraries and tools

## 🔧 Technology Stack Details

### Frontend Technologies

- **React**: UI library with concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **TypeScript**: Full type safety across the frontend
- **TanStack Router**: Modern file-based routing
- **TanStack Query**: Server state management
- **Apollo Client**: GraphQL client with caching
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: High-quality React components
- **React Hook Form**: Performant form handling
- **Zod**: Runtime type validation
- **i18next**: Internationalization

### Backend Technologies

- **NestJS**: Enterprise-grade Node.js framework
- **GraphQL**: Type-safe API with Apollo Server
- **REST APIs**: Traditional REST with Swagger docs
- **Prisma**: Next-generation ORM
- **PostgreSQL**: Robust relational database
- **JWT**: Secure authentication
- **Passport**: Authentication middleware
- **Argon2**: Secure password hashing
- **DataLoader**: Solve N+1 query problem
- **SWC**: Fast TypeScript/JavaScript compiler

### Python Technologies

- **FastAPI**: Modern, fast Python web framework
- **Pydantic**: Data validation using Python type hints
- **Uvicorn**: ASGI server implementation
- **uv**: Ultra-fast Python package installer
- **Ruff**: Extremely fast Python linter/formatter
- **MyPy**: Static type checker for Python
- **pytest**: Testing framework
- **asyncio**: Async/await support

### Development Tools

- **Turborepo**: Monorepo build system
- **pnpm**: Fast, disk-efficient package manager
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files

## 🚀 Getting Started Tips

### 1. 🎯 Just Run Kickstart (Most Important!)

**The kickstart command handles 95% of setup for you!**

- Don't manually configure each app - let kickstart do it
- Only customize environment variables if you need different settings
- The default configuration works for most development scenarios

### 2. Start Simple

Begin with one stack and gradually add complexity:

- Start with the TypeScript stack for traditional web app features
- Add Python backend when you need AI/ML capabilities or heavy processing

### 3. Environment Setup (After Kickstart)

The kickstart script does NOT handle environment files, so you'll need to:

- Create `.env` files manually (copy from `.env.example` if they exist)
- Configure database connections, API keys, and JWT secrets
- Set up PostgreSQL connection strings for your local database

### 4. Database-First Development

Design your data model in Prisma schema first:

- Run migrations: `cd packages/database && pnpm db:migrate`
- Generate types: `cd packages/database && pnpm db:generate`

### 5. Code Generation (Manual After Kickstart)

After kickstart, you'll need to run code generation manually:

- Run `pnpm build` to generate GraphQL types and REST API clients
- Run `pnpm db:generate` to generate Prisma database types
- These generators run automatically during development builds

### 6. Dependency Management

Install packages in the correct workspace:
! Typescript only !
Python uses uv, install those manually. `uv install` in the right directory (`apps/python`)

```bash
# Install in specific app
pnpm add package-name --filter=client
pnpm add package-name --filter=server

# Install in shared package
pnpm add package-name --filter=@repo/shared
```

### 7. Development Workflow

Recommended flow after kickstart:

1. Run `pnpm dev` to start all applications
2. Design database schema in `packages/database/prisma/schema.prisma`
3. Run migrations: `cd packages/database && pnpm db:migrate`
4. Build backend APIs (GraphQL/REST)
5. Generate frontend API clients: `pnpm build`
6. Build frontend components and pages
7. Add Python backend features as needed

## 🐛 Troubleshooting

> **💡 Most issues are avoided by running `pnpm kickstart` which sets everything up correctly.**

### Common Issues

**If kickstart fails**:

- Check that **Python** is installed and available as `python3`
- Make sure **curl** is available (for nvm installation)
- Re-run kickstart after fixing any missing prerequisites
- PostgreSQL doesn't need to be running during kickstart (only for actual development)

**Port Conflicts**:

- Frontend: 3000 (Vite)
- Backend: 4000 (NestJS)
- Python: 8000 (FastAPI)
- Database: 5432 (PostgreSQL)

**Environment Variables**:

- Kickstart does NOT create `.env` files - you need to set these up manually
- Copy `.env.example` files to `.env` in each app if they exist
- Configure database URLs, API keys, and JWT secrets as needed

**Python Dependencies**:

- Kickstart creates a Python virtual environment (`.venv`) automatically
- Uses pip to install dependencies from pyproject.toml
- Virtual environment is activated in `apps/python/.venv`

**Database Issues**:

- Kickstart does NOT set up the database - you need to do this manually
- Ensure PostgreSQL is running on the default port (5432)
- Run database migrations: `cd packages/database && pnpm db:migrate`
- Make sure your `.env` files have correct database URLs

## 📚 Additional Resources

- **Faktion guidelines**: https://github.com/faktionbe/faktion-guidelines
- **NestJS Documentation**: https://nestjs.com/
- **React Documentation**: https://react.dev/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Prisma Documentation**: https://www.prisma.io/docs/
- **TanStack Router**: https://tanstack.com/router/
- **Turborepo Documentation**: https://turbo.build/repo/docs

---

This kickstarter provides everything you need to build modern, scalable applications with both traditional web features and cutting-edge Python capabilities. The architecture scales from simple web apps to complex AI-powered applications while maintaining clean separation of concerns and unified development workflows.
