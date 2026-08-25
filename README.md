# pagarme-simplified-psp

![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-4-000000?logo=fastify&logoColor=white)

Simplified payment service inspired by [Pagar.me](https://pagarme.com.br),
built as a backend challenge (2023): it processes card transactions and
manages the resulting payables with payout scheduling rules.

## Features

- Transaction processing: value, description, payment method (`debit_card` / `credit_card`), card data
- Payable rules:
  - Debit card: funds available in D+1
  - Credit card: available in 4 monthly installments (D+30 to D+120), minus processing fee
- Transaction and payable listing endpoints
- Test coverage configured with Jest + Vitest

## Tech stack

| Layer | Tools |
|---|---|
| Language | TypeScript 5 |
| HTTP | Fastify 4 (+ Express interop) |
| Testing | Jest 29, Vitest, SWC |

## How to run

```bash
pnpm install
# see package.json for dev/test scripts
```

## Legacy note

Challenge project from early 2023 on TypeScript 5 / Fastify 4; close to
current majors. Estimated modernization effort if picked up later: minimal.
No fixes are planned as part of this cleanup phase.

## License

[MIT](LICENSE)

## Author

Built by [Tiago Gonçalves de Castro](https://github.com/tiagogcastro)
· [LinkedIn](https://www.linkedin.com/in/tiagogcastro)
