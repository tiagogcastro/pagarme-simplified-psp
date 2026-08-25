# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

Simplified Pagar.me style payment service: processes debit and credit card
transactions, schedules payables with method specific fees and settlement
dates, and exposes transaction and payable balance listings.
Express 5, TypeScript strict, Zod validation, Vitest, clean architecture.

## Domain rules

- Debit cards: one payable at D+1, status `paid`, 3 percent fee.
- Credit cards: four payables at D+30/60/90/120, status `waiting_funds`, 5 percent fee.
- Transactions store the gross amount; fees discount payable amounts only.
- Card numbers persist only the last four digits.

## Commands

```bash
pnpm install
pnpm dev          # watch dev server on :3333 (tsx watch)
pnpm build        # tsup production bundle into dist/
pnpm start        # run dist/server.js
pnpm test         # vitest suite
pnpm test:cov     # vitest with coverage
pnpm typecheck    # tsc --noEmit, must stay zero errors
pnpm lint         # eslint flat config
```

Use Node 22 (`nvm use`, `.nvmrc` provided). pnpm is the package manager.

## Conventions

- Single import alias: `@/` maps to `src/` (tsconfig paths + vitest alias + tsup).
  Relative imports inside the same module are fine; never introduce new aliases.
- Response envelope: success `{ data }`, failure `{ error }` (400 with details for
  Zod failures, 404 for unknown routes, 500 from the global error handler).
- Validate every request body at the route edge with a Zod schema.
- Keep domain pure: no express/zod imports inside `domain/` and `application/`
  use cases except controller contracts in `core/`.
- New dependencies must be approved before adding them.

## Rules for agents

- English only for repository content.
- Never use em dashes or en dashes anywhere (code, commits, docs).
- Conventional Commits, short messages, one logical block per commit.
- Never force push without explicit owner approval.
- Never commit secrets or the local-only REACTIVATION.md file.
- Run typecheck, lint and tests green before committing anything.
