# Server App

A modern NestJS application built with TypeScript, featuring GraphQL and REST APIs, authentication, database integration, and comprehensive validation.

## 🚀 Features

- **Modern NestJS Stack**: Built with NestJS, TypeScript, and Node.js
- **Dual API Support**: Both GraphQL and REST APIs with automatic schema generation
- **Authentication**: JWT-based authentication with Passport strategies
- **Database Integration**: Prisma ORM with PostgreSQL
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Validation**: Zod-based request/response validation
- **Pagination**: Built-in cursor and offset pagination support
- **Testing**: Comprehensive unit and e2e testing setup
- **Logging**: Structured logging with custom logger
- **CORS**: Configurable CORS for frontend integration
- **Environment Management**: Type-safe environment configuration

## 🛠 Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport strategies
- **API**: GraphQL (Apollo) + REST (Express)
- **Documentation**: Swagger/OpenAPI via Zod + `@repo/openapi`
- **Validation**: Zod schemas
- **Testing**: Jest with supertest
- **Logging**: Custom structured logger
- **Build**: SWC for fast compilation

## 📦 Installation

This app is part of a monorepo. To install dependencies:

```bash
# From the root directory
pnpm install
```

## 🚀 Development

### Start Development Server

```bash
# From the apps/server directory
pnpm dev
```

The server will be available at `http://localhost:4000`

### Build for Production

```bash
pnpm build
```

### Run Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## 🔧 API Documentation

The server automatically generates API documentation:

- **Swagger UI**: `http://localhost:4000/docs`
- **OpenAPI JSON**: `http://localhost:4000/docs/json`
- **OpenAPI YAML**: `http://localhost:4000/docs/yaml`
- **GraphQL Playground**: `http://localhost:4000/graphql`

## 📁 Project Structure

```
src/
├── modules/                 # Feature modules
│   ├── app/                # Main application module
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── app.service.ts
│   ├── auth/               # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.decorator.ts
│   │   ├── auth.module.ts
│   │   ├── auth.resolver.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   └── models/         # Auth DTOs and models
│   ├── common/             # Shared utilities
│   │   ├── decorators/     # Custom decorators
│   │   │   ├── user.decorator.ts
│   │   │   ├── validate-request.decorator.ts
│   │   │   ├── validate-response.decorator.ts
│   │   │   ├── api-cursor-pagination.decorator.ts
│   │   │   ├── api-offset-pagination.decorator.ts
│   │   │   └── form-data.decorator.ts
│   │   ├── guards/         # Authentication guards
│   │   │   ├── jwt.guard.ts
│   │   │   ├── local.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── interceptors/   # Request/response interceptors
│   ├── pagination/         # Pagination utilities
│   │   ├── pagination.module.ts
│   │   ├── pagination.service.ts
│   │   └── pagination.utils.ts
│   └── prisma/             # Database integration
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── utils/                  # Utility functions
│   ├── encrypt.ts
│   └── hash.ts
├── main.ts                 # Application entry point
└── env.ts                  # Zod-validated environment config
```

## 🔐 Authentication

The server implements comprehensive authentication:

### JWT Strategy

- **Token-based**: JWT tokens for stateless authentication
- **Configurable**: Secret key from environment variables
- **Guards**: `@Auth()` decorator for protected routes
- **User Context**: Automatic user injection via `@User()` decorator

### Local Strategy

- **Username/Password**: Traditional login with credentials
- **Password Hashing**: Argon2 for secure password storage
- **Validation**: Zod schemas for request validation

### Authentication Flow

1. **Login**: `POST /api/auth/login` - Returns JWT token
2. **Profile**: `GET /api/auth/profile` - Get current user info
3. **GraphQL**: `profile` query with JWT authentication

## 🌐 API Endpoints

### REST API (Prefix: `/api`)

#### Authentication

- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

#### GraphQL

- **Endpoint**: `/graphql`
- **Playground**: `/graphql` (development)
- **Introspection**: Enabled for code generation

## 🗄 Database Integration

### Prisma ORM

- **Database**: PostgreSQL
- **Schema**: Located in `packages/database/prisma/schema.prisma`
- **Migrations**: Automatic migration management
- **Service**: Global `PrismaService` for database operations

### Database Operations

```typescript
// Inject PrismaService
constructor(private prisma: PrismaService) {}

// Use in services
const users = await this.prisma.user.findMany();
```

## ✅ Validation

### Request / response validation

- **Zod schemas**: single source of truth (`z.infer` for TypeScript types)
- **Nest Standard Schema**: `StandardSchemaValidationPipe` + `StandardSchemaSerializerInterceptor`
- **OpenAPI**: `@repo/openapi` `zodStandardSchemaConverter` + `@ApiOkResponse({ standardSchema })`

### Example Validation

```typescript
@ApiOkResponse({ standardSchema: loginResponseSchema })
@SerializeOptions({ schema: loginResponseSchema })
async login(
  @Body({ schema: loginRequestSchema }) body: LoginRequest
): Promise<LoginResponse> {
  // Validated request body; response validated against loginResponseSchema
}
```

## 📄 Pagination

Built-in pagination support for both cursor and offset pagination:

### Cursor Pagination

```typescript
@ApiCursorPagination()
async getItems(@Query({ schema: cursorPaginationSchema }) query: CursorPagination) {
  // Cursor-based pagination
}
```

### Offset Pagination

```typescript
@ApiOffsetPagination()
async getItems(@Query({ schema: offsetPaginationSchema }) query: OffsetPagination) {
  // Offset-based pagination
}
```

## 🧪 Testing

### Unit Tests

- **Framework**: Vitest
- **Location**: `*.spec.ts` files alongside source code
- **Coverage**: `pnpm test:cov` (V8 provider)

### E2E Tests

- **Framework**: Vitest + Supertest
- **Location**: `test/` directory (`*.e2e-spec.ts`)
- **Config**: `vitest.config.e2e.ts`
- **Database**: Test database integration

### Test Commands

```bash
pnpm test              # Run unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # Coverage report
pnpm test:e2e          # E2E tests
pnpm test:debug        # Debug mode
```

## 🔧 Development Tools

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **SWC**: Nest CLI builder (`nest-cli.json`) for ESM emit and path-alias rewriting
- **Vitest**: Unit and e2e tests via `unplugin-swc`
- **NestJS CLI**: Code generation and scaffolding

## 📝 Scripts

```bash
pnpm dev               # Start development server
pnpm build             # Build for production
pnpm format            # Format code with Prettier
pnpm lint              # Run ESLint
pnpm test              # Run unit tests
pnpm test:watch        # Watch mode tests
pnpm test:cov          # Test coverage
pnpm test:e2e          # E2E tests
```

## 🔗 Dependencies

### Core Dependencies

- `@nestjs/*`: NestJS framework modules
- `@nestjs/apollo`: GraphQL integration
- `@nestjs/graphql`: GraphQL schema generation
- `@nestjs/swagger`: API documentation
- `@nestjs/jwt`: JWT authentication
- `@nestjs/passport`: Passport integration
- `prisma`: Database ORM
- `zod`: Schema validation
- `argon2`: Password hashing

### Development Dependencies

- `@nestjs/cli`: NestJS command line tools
- `@nestjs/testing`: Testing utilities
- `vitest`: Testing framework
- `supertest`: HTTP testing
- `@swc/*` / `unplugin-swc`: Fast compilation for Nest build and Vitest

## 🌍 Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development
ENVIRONMENT=local

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Authentication
JWT_SECRET="your-jwt-secret-key"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

## 🔒 Security Features

- **CORS**: Configurable cross-origin resource sharing
- **Password Hashing**: Argon2 for secure password storage
- **JWT**: Secure token-based authentication
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Built-in protection against abuse
- **Helmet**: Security headers via NestJS

## 📊 Monitoring & Logging

- **Structured Logging**: Custom logger with different levels
- **Request Logging**: Automatic request/response logging
- **Error Handling**: Global exception filters
- **Performance**: Request timing and metrics

## 🤝 Contributing

1. Follow NestJS conventions and patterns
2. Use TypeScript for all new code
3. Add proper validation with Zod schemas
4. Write tests for new features
5. Update API documentation
6. Follow the established module structure
7. Use dependency injection patterns

## 📄 License

This project is part of the Faktion Kickstarter monorepo.
