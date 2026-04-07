# Agent and AI context (course deliverable)

This repository was produced as an **implementation example** using a coding assistant (Cursor Agent). The following notes are for reviewers who evaluate **how** the system was specified and generated.

## Product intent

- **Domain:** Community boat tours offered by local guides (no commercial permit framing in code; that is a legal/business concern outside the repo).
- **Style:** Small **Micronaut** microservices behind **REST**, each with its own **H2 file database**, packaged in a **monorepo** folder layout without shared Java modules between services.

## Architectural rules (enforced in the tree)

| Rule | How it shows up |
|------|------------------|
| No shared backend code | `tour-service` and `guide-service` use different Java packages and duplicate only what Gradle/Maven would normally duplicate (dependencies), not a `common-lib` project. |
| Layering | Each service has `model`, `repository`, `service`, `controller` (+ `dto` where needed). |
| Isolated data | Flyway migrations live under each service’s `resources/db/migration`; JDBC URLs point at distinct H2 files under each service’s `data/` when run from that service directory. |
| Separate deploy | Each service has its own `scripts/dev.*` and `scripts/prod.*`; fat JARs are built per subproject. |

## Frontend

- **React + Vite + Tailwind CSS v4** (`@tailwindcss/vite`).
- Dev traffic uses **Vite proxy** paths `/api/tours` and `/api/guides` so the browser stays same-origin during development; backends still expose `/tours` and `/guides` directly for tools like `curl`.

## Ports (local defaults)

| Component | Port |
|-----------|------|
| tour-service | 8080 |
| guide-service | 8081 |
| frontend (dev / preview) | 5173 / 4173 |

## Suggested review commands

From the monorepo root (Java 17+, Node 20+ recommended):

```powershell
.\gradlew.bat :tour-service:build :guide-service:build
```

```powershell
# three terminals
.\tour-service\scripts\dev.ps1
.\guide-service\scripts\dev.ps1
.\frontend\scripts\dev.ps1
```

## Cursor rule file

See `.cursor/rules/boat-tours-monorepo.mdc` for persistent editor/agent guidance aligned with this project.
