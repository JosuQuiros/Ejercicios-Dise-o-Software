# Architecture: motorcycle parts exchange (local serverless)

## Topology

```text
Client (curl / Postman / Insomnia)
        │ HTTP
        ▼
serverless-offline :3000  ──►  Lambda handlers (createPart, listPartsByType)
                                      │
                                      ▼
                               PartService (rules, validation orchestration)
                                      │
                                      ▼
                               PartRepository (DynamoDB access)
                                      │
                                      ▼
DynamoDB Local (Docker) :8000   Table: motorcycle-parts-api-parts-<stage>
```

- **Decoupled functions**: one Lambda handler per route (`POST /parts`, `GET /parts`), each importing a fresh service instance (simple, test-friendly boundary).
- **No real AWS**: the AWS SDK is configured with `DYNAMODB_ENDPOINT=http://localhost:8000` and dummy credentials when talking to DynamoDB Local. API Gateway and Lambda are **emulated** by `serverless-offline`.

## Paradigm

- **Layered architecture**
  - **Models** (`src/models`): validation and domain constraints for payloads and query params (pure functions, no I/O).
  - **Repositories** (`src/repositories`): all DynamoDB reads/writes; hides table name, index name, and query shape.
  - **Services** (`src/services`): use cases (`registerPart`, `listByType`); coordinates validation + persistence.
  - **Handlers** (`src/handlers`): HTTP adapter — parse JSON, map service results to API Gateway–style responses (status, CORS headers).
  - **Lib** (`src/lib`): shared infrastructure (document client factory).

This keeps **business rules** out of handlers and **storage details** out of services, which matches common serverless team practices (handlers stay thin).

## Data model (DynamoDB)

- **Primary key**: `id` (string, UUID for user-created rows; fixed ids for seed data).
- **Attributes**: `name`, `type`, `price`, `createdAt`.
- **Access pattern**: list by part category → **GSI** `type-index` with partition key `type`, sort key `id`.

`Query` on the GSI returns all parts for a given `type`. Adding more access patterns later would mean additional GSIs or a single-table design; this exercise keeps the minimum viable index set.

## Technology choices

| Concern | Choice | Rationale |
|--------|--------|-----------|
| Local API | `serverless-offline` | Standard Serverless Framework dev loop, maps `http` events to local HTTP + Lambda emulation |
| Local DB | Official `amazon/dynamodb-local` image | Portable, no Java install on host, works well on Windows with Docker |
| SDK | AWS SDK for JavaScript v3 (`@aws-sdk/*`) | Current AWS client libraries; `DynamoDBDocumentClient` for ergonomic JS types |
| Simulated prod | `serverless package --stage prod` | Produces deployment artifacts and resolves `stage` in names without touching a cloud account |

## Operational stages

- **`dev` (default)**: table name `motorcycle-parts-api-parts-dev`.
- **`prod` (offline simulation)**: table name `motorcycle-parts-api-parts-prod` — use the same Docker DynamoDB but run `init`/`seed` with `PARTS_TABLE` set accordingly so lambdas and DB agree.

## Security note (local only)

CORS is set to `*` for convenience in local demos. A production deployment would restrict origins, add authentication, and use IAM least privilege for DynamoDB.
