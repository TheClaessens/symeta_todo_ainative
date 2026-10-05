# General code conventions

Use these when writing TypeScript for React or Node applications. Apply UI, database and queue guidance
only when those layers exist. Each rule describes a practice and when it matters, not a defect to hunt
for. Project-specific conventions take precedence; leave mechanical checks to the compiler, linter and
CI. If a mechanical check is spotted that isn't covered, extend/improve the `pre-commit-config.yaml`.

## Correctness

- **Separate absence from values.** Handle `0`, `''`, empty collections, `null` and `undefined` according to their meaning; do not use truthiness when a falsy value is valid.
- **Preserve existing contracts.** Before refactoring or changing a shared helper, trace its callers, including callers outside the change, and test behavior you intend to keep.
- **Match names to failure behavior.** A helper named `is…` or `can…` should return a boolean for expected invalid input; name a throwing check `assert…` or `validate…` instead. Use type-guards when appropriate.
- **Make failures visible.** Propagate errors or move work into an explicit failure state; do not log and return success. Handle rejections on intentionally unawaited promises.
- **Await work that matters to the result.** Run independent work concurrently only when order does not matter, and handle each failure; await dependent work and required cleanup before returning.
- **Clean up on every exit.** Use `finally` or equivalent when resources must be released after errors or early returns.
- **Use Zod for boundary validation.** Define schemas for untrusted requests, messages, stored JSON, `localStorage` and external responses; use `parse` or `safeParse` and consume the parsed value. Derive TypeScript types with `z.infer`; a type, cast or generic is not runtime validation. Use `z.url()` for URL fields and `z.enum(SomeEnum)` for TypeScript enums, not `z.nativeEnum`. Use zod v4.x, not the older v3.x!
- **Make switches exhaustive.** When switching over a discriminated union or enum, handle each known member; assign the switched value to `never` in `default` and throw so new members fail type checking and unexpected runtime values fail visibly.

Example:

```ts
type Status = { kind: 'pending' } | { kind: 'done' };
const isDone = (status: Status): boolean => {
  switch (status.kind) {
    case 'pending':
      return false;
    case 'done':
      return true;
    default: {
      const exhaustiveCheck: never = status;
      throw new Error(`Unexpected variant: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
};
```

## Type safety

- **Prefer sound types.** Avoid `any`; use precise types in application code and `unknown` for unchecked inputs. Narrow before use instead of casting away type mismatches, and isolate unavoidable library interop exceptions.
- **Annotate constants built against a contract.** When subsequent reads should have the contract's type, declare `const payload: Contract = { ... }`, not just `const payload = { ... } satisfies Contract`. `satisfies` checks assignability but preserves the literal's inferred type; use it when that narrower type is intentional.
- **Do not suppress TypeScript diagnostics.** Do not add `@ts-ignore`, `@ts-nocheck` or `@ts-expect-error`; fix the types or isolate inaccurate third-party declarations at the boundary.
- **Reuse generated contract types.** When a schema or API provides generated types, use them rather than defining parallel shapes that can drift.

## Database and migrations

- **Treat applied migrations as history.** Add a new migration instead of editing one already deployed.
- **Stage constraints and type changes.** Backfill and clean existing rows before adding required or unique constraints; check stored values before narrowing.
- **Plan data-changing migrations.** Get an explicit decision before deleting or rewriting data, and provide a recovery plan.
- **Justify indexes with access patterns.** Consider the queries they serve, representative data volume and write cost before adding or removing an index.

## API and data access

- **Scope lookups to their context.** Include the tenant, owner, version or other boundary that changes which rows the caller may see.
- **Batch repeated reads.** Avoid per-item queries over collections; on hot paths, select only fields the caller needs rather than fetching whole rows.
- **Key caches by the full result identity.** Include filters, tenant and any other input that changes a cached or batched result.
- **Avoid nested scans of growing collections.** For membership tests over two potentially large lists, build a `Set` once instead of calling `includes` inside `filter`, `some` or `every`.
- **Define empty-filter semantics.** Decide whether an empty or absent selection means no matches or all matches, and preserve that meaning from API input to query.
- **Make single-row assumptions explicit.** Use a unique key or enforce the expected cardinality rather than taking the first row that happens to match.
- **Keep lookup contracts unambiguous.** Give a lookup one required key and name it for that key; use separate functions instead of switching between mutually exclusive optional lookup inputs.
- **Make pagination deterministic.** Sort by a stable key with a unique tie-breaker; use a cursor or snapshot if inserts or deletes between pages must not move results.
- **Keep dependent writes atomic.** Use a transaction when partial success would break an invariant; keep slow external calls out of it.
- **Pass intent to shared write helpers.** Let a helper derive the resulting status or timestamp from the caller's intended action rather than making callers encode intent in a status literal.
- **Evolve external contracts deliberately.** When changing an endpoint, exported JSON, schema field or message, update consumers and plan for old messages or clients that may still be in use.

## Frontend / UI

- **Components should follow composition pattern.** All highly-reusable components live under `components/ui` and are taken or adapted from `shadcn`. When shadcn does not provide such a componnet, look for a replacement in our own registry: https://registry.faktion.com/.
- **Distinguish ui, blocks and routes**. If a component is feature unrelated and/or highly reusable, it should be a `ui component` (`components/ui`). If a component is tied to a certain feature but used across multiple routes, it should be a `block` (`components/blocks`). If a component is a composition of multiple blocks, it is likely a route.
- **Derive display state when possible.** Do not copy props into local state just to render them; if a local edit draft is needed, reset it when the entity being edited changes.
- **Subscribe to what the component uses.** Select a relevant slice of shared state instead of re-rendering on unrelated store changes.
- **Tie effects to real changes.** If a dependency is recreated on each render, restructure the effect around stable inputs instead of suppressing its dependency warnings.
- **Tie effects to their lifetime.** Clean up subscriptions and timers, and cancel or ignore stale async responses on dependency change or unmount.
- **Key lists by item identity.** Use stable IDs rather than array indexes when items may be inserted, removed or reordered, so component state stays with the right item.
- **Represent network outcomes.** For Suspense-enabled reads, use `<Suspense>` for pending and an error boundary with a retry path for failures. Show an empty state after a successful empty result; handle mutation errors separately, since error boundaries do not catch event-handler failures, ideally with retry functionality.
- **Keep mutations and views consistent.** Prevent unintended duplicate submissions while a write is pending, and update or invalidate cached views after it succeeds.
- **Keep equivalent flows aligned.** Apply a behavior to bulk/single or table/detail routes when both expose the same action.
- **Name React handlers by ownership.** Reserve `on…` for callback props supplied by a parent; name local handlers for the action they perform.
- **Use accessible and localizable UI.** Follow the project's translation system if it has one; use semantic controls, accessible names and keyboard/focus/error feedback for interactive changes.

## Queues

- **Expect repeat delivery.** Make a handler idempotent or deduplicate messages before non-idempotent effects when its queue can redeliver.
- **Make failure recoverable.** Move jobs or entities out of intermediate states on terminal failure and provide a path to retry or inspect them.
- **Retry selectively.** Retry transient failures with bounded backoff; retry writes only when they are idempotent or protected by deduplication.
- **Bound fan-out.** Limit concurrency for large external or database workloads, and await or report each failure rather than silently dropping it.
- **Publish committed work.** Enqueue jobs after the row they reference commits, or use a transactional outbox when publishing and writing must be reliable together.

## Security

- **Authorize at the server boundary.** Check permissions on reads and writes, including sibling paths to destructive actions; hiding a UI control is not authorization.
- **Keep server-managed fields server-managed.** Accept only writable input fields; derive IDs, timestamps and state the server owns instead of trusting client-supplied values.
- **Use safeguards appropriate to each sink.** Parameterize queries, pass subprocess arguments without shell interpolation, constrain resolved file paths and sanitize untrusted HTML if it must be rendered.
- **Never commit secrets.** Keep credential-bearing `.env` files, tokens, connection strings, API keys, private keys, certificates containing private keys and customer credentials out of source and test fixtures. Use placeholders or secret storage instead. Extend `.cursorignore` or equivalent when senstive information is spotted.
- **Protect personal data.** Use synthetic fixtures; keep personal data out of logs and error responses, or redact it where logging is necessary.
- **Protect cookie-authenticated writes.** Apply CSRF protection to state-changing routes when browser authentication uses cookies.

## Consistency and maintainability

- **Reuse domain behavior.** Check analogous code and existing shared helpers before implementing; place new logic with the concern it owns, not just beside its first caller.
- **Choose names that survive the change.** Name what a value or function means; avoid `new`/`old`/`v2` unless a version is part of an external contract.
- **Use descriptive, consistent names.** Avoid abbreviations, single-letter names and generic labels; name functions for what they return, use plural names for ID collections, and drop redundant qualifiers. When a file has one principal export, rename the file with that export.
- **Mark intentionally unused parameters.** Start their names with `_` (for example, `_event`); omit the parameter when the signature permits it.
- **Mark intentionally private parameters.** Start their names with # (for example, #accessToken`).
- **Follow domain vocabulary.** Use the project's lexicon or glossary when one exists; keep one term per concept and one meaning per term.
- **Name non-obvious values.** Give domain thresholds and units meaningful names when a literal's purpose is unclear; obvious values such as `0` and `1` need no constant.
- **Prefer positive conditions.** Express checks and branches positively when the equivalent negated form is harder to follow; avoid double negations and conditions that obscure the successful path.
- **Use arrow functions for standalone functions.** Prefer `const doThing = () => { ... }` over `function doThing() { ... }`; use method or declaration syntax when the API requires it.
- **Avoid nested ternaries.** Use `if`/`else` or named intermediate values when branching would otherwise hide which condition produces a result.
- **Name multiple arguments.** Give functions with more than one argument a single options object so callers can see what each value means without depending on positional order.
- **Extract helpers for complex control flow.** When a function's cognitive complexity exceeds 20, extract cohesive, well-named helpers that clarify the behavior, not just fragments that lower a score.
- **Keep documentation current.** Update documentation when a public contract changes.
- **Validate configuration centrally.** Read environment variables through one configuration boundary and validate required values at startup instead of scattering unvalidated reads.
- **Leave no accidental leftovers.** Remove dead or commented-out code and debug output; tie deferred work to an issue or decision rather than leaving context-free TODOs.

## Comments

- **Default to no comments.** Before adding one, name what a competent future reader would get wrong without it; otherwise clarify the code instead. The same test applies in tests, where `describe`/`it` names the scenario.
- **Explain what code cannot.** Comment on an external constraint, a trap that names what breaks, a measured decision with its measurement, or a reference to a work item, ADR or known algorithm; a `TODO` must carry a work-item reference.
- **Skip redundant comments.** Do not restate statements, label or number blocks, narrate the diff or conversation, defend an obvious choice, leave commented-out code or add banners.
- **Document exports sparingly.** Add a doc comment only when an export's name and signature do not convey its contract; describe what it does in plain prose, not how, without JSDoc tags or a function description inside its body. Prefer one short line, at most five when necessary.
- **Review added comments.** Before finishing, inspect every comment line you added: delete those that fail the test, then shorten the rest. For a Git diff, use:

```bash
git diff -U0 -- '*.ts' '*.tsx' ':(exclude)*generated*' | grep -E '^\+\s*(//|/\*|\*)'
```

## Scope and verification

- **Keep changes focused.** Avoid unrelated cleanup and explain intentional differences between supported environments or client paths.
- **Regenerate from sources.** After changing a schema or query that produces code, run its generator and include required output; do not hand-edit generated artifacts.
- **Remove features end-to-end.** Check APIs, storage, UI, translations, tests, generated types and documentation for remaining uses; migrate data and regenerate outputs rather than editing applied migrations or generated files by hand.

## Tests

- **Test observable behavior.** Add or update focused tests for new behavior and regressions, including meaningful failure paths rather than only happy paths; avoid testing private implementation details.
- **Exercise relevant boundaries.** Test absent, empty and zero inputs, authorization boundaries, duplicate delivery or retry behavior where they affect the change; await async results before asserting.

## Design smells — judgement calls

These are prompts for design judgement, not hard bans. Project standards override them.

- **Duplicated Code.** When two implementations carry the same business rule and could drift, share the rule. Similar syntax alone is not enough.
- **Data Clumps.** When the same related fields repeatedly travel together, consider a cohesive type. A one-off group of parameters does not need one.
- **Primitive Obsession.** When interchangeable primitive IDs or unconstrained states cause mix-ups, consider domain types or a union. Do not wrap every string.
- **Speculative Generality.** Add hooks, options or abstraction for a current need, not a possible future one; inline indirection that has no present use.
