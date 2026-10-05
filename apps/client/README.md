# Client App

A modern React application built with TypeScript, featuring authentication, internationalization, and a comprehensive UI component library.

## 🚀 Features

- **Modern React Stack**: Built with React, TypeScript, and Vite
- **Authentication**: JWT-based authentication with protected routes
- **Internationalization**: Multi-language support with i18next
- **UI Components**: Comprehensive component library built with Radix UI and Tailwind CSS
- **State Management**: TanStack Query for server state and React Query for client state
- **GraphQL Integration**: Apollo Client with code generation
- **REST API Integration**: Orval for automatic API client generation
- **Routing**: TanStack Router with type-safe routing
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system

## 🛠 Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: [shadcn](https://ui.shadcn.com/docs) + [faktion-ui](https://faktion-ui.vercel.app/)
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **GraphQL**: Apollo Client
- **Forms**: React Hook Form + Zod
- **Internationalization**: i18next
- **Code Generation**: GraphQL Code Generator, Orval

## 📦 Installation

This app is part of a monorepo. To install dependencies:

```bash
# From the root directory
pnpm install
```

## 🚀 Development

### Start Development Server

```bash
# From the apps/client directory
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## 🔧 Code Generation

The app uses automatic code generation for both GraphQL and REST APIs:

### GraphQL Code Generation

Generate TypeScript types and React hooks from GraphQL schema:

```bash
pnpm codegen:graphql
```

This generates types and hooks in `src/graphql/generated.ts` based on:

- GraphQL schema from the backend
- GraphQL documents in `src/**/*.graphql`

### REST API Code Generation

Generate TypeScript client from OpenAPI/Swagger schema:

```bash
pnpm codegen:api
```

This generates API client code in `src/api/generated.ts` based on:

- OpenAPI schema from `../server/.generated/schema.json`
- Uses React Query for data fetching

## 📁 Project Structure

```
src/
├── api/                    # REST API integration
│   ├── generated.ts       # Auto-generated API client
│   ├── instance.ts        # Axios instance configuration
│   └── utilities.ts       # API utilities
├── components/            # Reusable components
│   ├── blocks/           # Layout and page-level components
│   │   ├── layout/       # Layout components
│   │   └── sidebar/      # Sidebar components
│   └── ui/               # Base UI components
│       ├── button.tsx    # Button component
│       ├── card.tsx      # Card component
│       ├── form.tsx      # Form components
│       └── ...           # Other UI components
├── graphql/              # GraphQL integration
│   ├── auth.graphql      # Authentication queries
│   └── generated.ts      # Auto-generated types and hooks
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization
│   ├── config.ts         # i18next configuration
│   └── en/               # English translations
├── providers/            # React context providers
│   ├── apollo-provider.tsx
│   ├── auth-provider.tsx
│   └── tanstack-provider.tsx
├── routes/               # Application routes
│   ├── (app)/           # Protected app routes
│   ├── (auth)/          # Authentication routes
│   └── root.tsx         # Root route component
├── lib/                  # Utility functions
├── main.tsx             # Application entry point
└── routes.tsx           # Route definitions
```

## 🔐 Authentication

The app implements JWT-based authentication with protected routes:

- **Login**: `/auth/login` - Public route for user authentication
- **Protected Routes**: All routes under `/app/*` require authentication
- **Redirect Logic**: Unauthenticated users are redirected to login
- **Context**: Authentication state is managed via React Context

## 🌐 Internationalization

Multi-language support using i18next:

- **Configuration**: `src/i18n/config.ts`
- **Translations**: `src/i18n/en/translation.json`
- **Usage**: Components use `useTranslation` hook

## 🎨 UI Components

The app includes a comprehensive UI component library:

### Base Components

- **Button**: Variants, sizes, and states
- **Input**: Form inputs with validation
- **Card**: Content containers
- **Badge**: Status indicators
- **Avatar**: User profile images

### Layout Components

- **AppLayout**: Main application layout
- **Sidebar**: Navigation sidebar
- **Centered**: Centered content layout

### Form Components

- **Form**: Form wrapper with validation
- **Label**: Form labels
- **Dropdown**: Dropdown menus

All components are built on Radix UI primitives and styled with Tailwind CSS (shadcn).

## 🔄 State Management

- **Server State**: TanStack Query for API data
- **Client State**: React Context for authentication and app state
- **Form State**: React Hook Form for form management

## 🛣 Routing

Type-safe routing with TanStack Router:

- **Route Protection**: Automatic authentication checks
- **Type Safety**: Full TypeScript support
- **Code Splitting**: Automatic route-based code splitting
- **Search Params**: Type-safe search parameter handling

## 🧪 Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Vite**: Fast development server and build tool

## 📝 Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm codegen:graphql  # Generate GraphQL types and hooks
pnpm codegen:api      # Generate REST API client
```

## 🔗 Dependencies

### Core Dependencies

- `react` & `react-dom`: React framework
- `@tanstack/react-router`: Type-safe routing
- `@tanstack/react-query`: Server state management
- `@apollo/client`: GraphQL client
- `react-hook-form`: Form management
- `i18next`: Internationalization

### UI Dependencies

- `@radix-ui/*`: UI primitives
- `tailwindcss`: Utility-first CSS
- `lucide-react`: Icons
- `class-variance-authority`: Component variants

### Development Dependencies

- `vite`: Build tool
- `typescript`: Type checking
- `@graphql-codegen/*`: GraphQL code generation
- `orval`: REST API code generation

## 🌍 Environment Variables

Create a `.env` file in the client directory:

```env
VITE_BACKEND_URL=http://localhost:4000
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper TypeScript types
4. Use the existing UI component library
5. Follow the established routing patterns
6. Add translations for new text content

## 📄 License

This project is part of the Faktion Kickstarter monorepo.
