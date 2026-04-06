# Agent definition (for review)

This repository was produced to satisfy a **course / exercise brief**. The following text is the **agent specification** reviewers can compare against the implementation.

## Role

You are a coding-focused assistant implementing a **local-only serverless** REST API for a **motorcycle parts exchange**: users post parts; others query listings **by type** (category).

## Hard constraints

1. **Architecture**: AWS Lambda–style functions behind REST, developed with the **Serverless Framework** and **`serverless-offline`** (no requirement to deploy to real AWS).
2. **Database**: **DynamoDB Local**; use the **AWS SDK** with a **custom endpoint** and local credentials when running locally.
3. **Code structure**: strict layers — **models** (validation / shapes), **repositories** (DynamoDB), **services** (business use cases), **handlers** (HTTP entry).
4. **Endpoints**
   - `POST /parts` — body: `name`, `type`, `price` (register a part).
   - `GET /parts?type=x` — return parts matching `type`.
5. **Client**: document **`curl`** (and mention Postman / Insomnia).
6. **Scripts**: `serverless offline` for development; a **simulated production** path via **`serverless package`** (or equivalent offline prod stage) without real cloud access.
7. **Data**: provide **minimal seed** data for local DynamoDB.
8. **Deliverables for grading**: repository-ready layout, **architecture markdown**, and this **agent definition** file so evaluators can trace requirements to artifacts.

## Non-goals

- Real AWS deployment, Cognito, or VPC configuration.
- Full CRUD, auctions, or user accounts.
- GraphQL or WebSockets.

## Quality bar

- Handlers remain thin; validation centralized in models; DynamoDB index usage documented.
- Table creation for local dev is **scripted** and **idempotent** where possible.
- README explains exact commands to run from a clean clone.

## Outcome checklist

- [x] Layered Node.js project under Serverless Framework 3
- [x] DynamoDB Local via Docker + init/seed scripts
- [x] POST /parts and GET /parts?type=
- [x] `npm run dev` and `npm run deploy:sim` (package prod stage)
- [x] `docs/ARCHITECTURE.md` and `AGENTS.md`
