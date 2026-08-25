# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

Pagar.me-style payment service challenge (2023): processes transactions
(debit/credit card) with payable scheduling rules and exposes transaction/
payable listings. Fastify + Express hybrid, Vitest/Jest tests, DDD layout.

## Domain rules

- Debit cards: payable available in D+1
- Credit cards: payable in 4 installments (D+30 ... D+120)
- Fee applied per method

## Commands

```bash
pnpm install
npm run dev       # ts-node-dev entry (see package.json)
npm test          # Jest + Vitest suites configured
```

## Structure

- `src/modules/transaction`: transaction creation and listing
- `src/modules/payable`: payable calculation and listing
- `src/core`, `src/shared`: kernel and shared utilities

## Rules for agents

- Docs-only maintenance phase: no dependency upgrades or runtime behavior changes
