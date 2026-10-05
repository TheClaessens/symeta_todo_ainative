# Client

## Faktion Registry first

Before building any component, hook, form control, table helper, chat/AI block or recipe, search [registry.faktion.com](https://registry.faktion.com/) by capability.

| Registry result | Action                                                       |
| --------------- | ------------------------------------------------------------ |
| Full match      | Install it; use as-is.                                       |
| Partial match   | Install it, then wrap or extend locally.                     |
| No match        | Use stock shadcn/ui or `src/components/ui/`; hand-roll last. |

Install from `apps/client` with `REGISTRY_BEARER_TOKEN` in `.env` (1Password): `pnpm dlx shadcn@latest add @faktion/<name>`. Skip `prompthandler` (Python). Keep generated registry files unmodified unless forking deliberately. If you hand-roll, say in the handover why the registry didn't fit.

## Gotchas

- Import every shadcn/Radix part from `@/components/ui/*`. Mixing in `@radix-ui/react-*` imports breaks context ("DialogTrigger must be used within Dialog").
- CVA drops `className` passed inside `variants({...})`; write `cn(buttonVariants({ variant, size }), className)`.
- Tabs containing RHF fields: mount only the active tab (no `forceMount`), or dialogs open slowly.
- Vite "does not provide an export named default" for a CJS package: add the package and its direct importer to `optimizeDeps.include` in `vite.config.ts`.
- Routing is code-based: register every route in `src/routes.tsx` (`createRoute` + `getParentRoute`). Files under `src/routes/` are plain screen components imported there; `(group)` folders are organisation only. Guard routes with `beforeLoad` using `context.auth`.
- Codegen output: `src/api/generated.ts` and `src/graphql/generated.ts`.
- Auth: the JWT lives in `localStorage`. REST 401s (TanStack Query) log out; GraphQL errors are only logged.

## Testing

Vitest for unit and component tests; Playwright for end-to-end tests and for checking UI changes in a real browser before handover. Neither is installed yet: the first test of each kind sets up its runner and a `package.json` script.

## Components

- Explicit props `interface`, `FC` where the surrounding code uses it, `className` on reusable pieces.
- Positive boolean props with defaults (`isEditable = true`).
- Layout via flex/grid + `gap`; theme tokens from `index.css` (`primary`, `muted`, `destructive`, …); Tailwind text classes for headings; drop wrappers that carry no layout or semantics.
- Icons keep their size regardless of children; compact variants come from explicit props.
- Render dialogs and panels conditionally from the parent rather than passing `open` down. One source of truth per piece of state.
- Single-consumer state lives in a hook; a provider only when disconnected components share it.
- Put route screens in the route file; extract a child only when it's reused.
- Conditional JSX: `condition && <X />`, coercing non-booleans with `!!`.
- `useMemo` for values derived by scanning/filtering collections. Normalize optionals before array methods: `(items ?? []).some(...)`.

## Data

- Use generated Orval / GraphQL hooks.
- Fetch a single entity from a by-id endpoint.
- Pass table pagination state to list endpoints.
- Mutations: pass `onSuccess`/`onError` at the `mutate` call site unless several call sites share them; start submit handlers with `if (isPending) return;`.
- Error UI takes the query's real error (`hasError={!!error}`); retry refetches only the failed queries.

## Forms and i18n

- RHF + Zod. Custom controlled fields forward `name`, `ref` and `onBlur` from `field`.
- Children call `useTranslation` themselves; pass semantic data/mode props, not translated strings.
- `Trans` when a string embeds React elements (numeric keys in `components`).
- Reuse shared keys in `src/i18n/en/translation.json` (`general.toast.fetchFailed`, `general.entity.*`, …) before adding new ones; keep every locale's structure in sync.
