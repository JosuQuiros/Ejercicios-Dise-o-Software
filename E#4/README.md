# Motorcycle parts exchange API (serverless, local)

REST API where sellers register **motorcycle parts** (`name`, `type`, `price`) and buyers list items **by type** (category). Everything runs **locally**: API via **Serverless Offline**, persistence via **DynamoDB Local** in Docker, **AWS SDK for JavaScript v3** with a custom endpoint (no real AWS account required).

## Stack

- **Runtime**: Node.js 20, Serverless Framework 3, `serverless-offline`
- **Data**: DynamoDB Local (`amazon/dynamodb-local`)
- **Layers**: `handlers` → `services` (business logic) → `repositories` → `models` + `lib`

## Prerequisites

- Node.js 18+
- Docker (for DynamoDB Local)
- `curl`, or Postman / Insomnia

## Quick start

```bash
cd motorcycle-parts-api
npm install
docker compose up -d
npm run db:init
npm run db:seed
npm run dev
```

API base URL: `http://localhost:3000` (or `http://localhost:3010` if you use `npm run dev:3010` because port 3000 is taken).

There is **no** `GET /` homepage — only **`GET /parts?type=...`** and **`POST /parts`**. Opening `/` shows a JSON 404 from serverless-offline listing valid routes; that is normal.

### Troubleshooting

- **Do not run `npm audit fix --force` on this project.** It upgrades Serverless to **v4**, which breaks `frameworkVersion: "3"` (`No version found for 3`) and can require `serverless login`. The audit warnings in dev tooling are acceptable for this local exercise; reinstall pinned versions with `npm install` if you already forced an upgrade.
- **`npx serverless` wants to install v4** — `npx` may offer **serverless@4.x** before it uses your project. Answer **no**, or avoid `npx` and run **`npm run serverless:version`** (uses `node_modules` only) or **`npm run dev`** to start the API.
- **`No version found for 3`** — Your `serverless` CLI is **v4** but `serverless.yml` expected **v3** (or the opposite mismatch). This repo pins **Serverless 3.40.0** in `package.json` so offline works **without** `serverless login`. Run `npm install` again after pulling changes; check with **`npm run serverless:version`** — expect **Framework Core: 3.x** and **(local)**.
- **`serverless login` / license errors** — Serverless **v4+** can require authentication even for local commands. Stay on the pinned **v3** devDependency for class/local use.
- **Browser says connection refused** — `npm run dev` must stay running in a terminal; if it exited with an error, nothing listens on port 3000 until you fix the error and start it again.
- **`EADDRINUSE` on port 3000** — Port 3000 is already in use, usually by a **previous** `serverless offline` still running (if `http://localhost:3000/parts?...` still works after a “failed” `npm run dev`, that confirms it). On Windows, find the real PID: `netstat -ano | findstr :3000` — use the **last column** (a number like `18432`, not the literal `12345` from examples). Then `taskkill /PID 18432 /F` (replace with your PID). After that, run `npm run dev` again. **Or** skip freeing 3000 and start on another port: **`npm run dev:3010`**, then call `http://localhost:3010/parts?...`.
- **`EADDRINUSE` on port 3002 (or 3102)** — Another process is using serverless-offline’s Lambda port (often an old `serverless offline` you closed with **X** instead of **Ctrl+C**). This repo uses **`lambdaPort: 3102`** in `serverless.yml` to reduce clashes. To free a port on Windows: `netstat -ano | findstr :3102` then `taskkill /PID <your-pid> /F`, or close the terminal that is still running the old server.

### Stop DynamoDB Local

```bash
npm run db:down
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run db:up` | Start DynamoDB Local (Docker) |
| `npm run db:down` | Stop DynamoDB Local |
| `npm run db:init` | Create table + `type-index` GSI on local DynamoDB |
| `npm run db:seed` | Insert two minimal sample parts (`brakes`, `engine`) |
| `npm run dev` | **Development**: Serverless Offline + `DYNAMODB_ENDPOINT` → localhost |
| `npm run dev:3010` | Same as `dev` but HTTP on **3010** if **3000** is already taken |
| `npm run offline:prod` | Same as dev but `--stage prod` (separate logical table name via `PARTS_TABLE`) |
| `npm run deploy:sim` | **Simulated prod**: `serverless package --stage prod` (artifact only, no cloud deploy) |
| `npm run db:init:prod` | Create **prod-stage** table name on DynamoDB Local |
| `npm run db:seed:prod` | Seed minimal rows into **prod-stage** table |

After `npm run offline:prod`, run `db:init:prod` and `db:seed:prod` once so the `PARTS_TABLE` env matches the packaged stage.

## HTTP API

### Register a part

`POST /parts`

```bash
curl -s -X POST http://localhost:3000/parts ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Rear sprocket 45T\",\"type\":\"drivetrain\",\"price\":42}"
```

PowerShell alternative:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/parts `
  -ContentType "application/json" `
  -Body '{"name":"Rear sprocket 45T","type":"drivetrain","price":42}'
```

### List parts by type

`GET /parts?type=<type>`

```bash
curl -s "http://localhost:3000/parts?type=brakes"
```

## IaC note

`serverless.yml` declares the same DynamoDB table for **documentation and packaging** (`serverless package`). **Local execution** uses the Docker instance and `scripts/init-dynamodb-local.js` so you do not need to deploy to AWS.

## Review docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — topology, paradigm, technology choices
- [`AGENTS.md`](AGENTS.md) — agent brief used to generate this example (for course review)

## License

MIT (exercise / educational use).
