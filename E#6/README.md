# Boat tours — Micronaut microservices monorepo

Ejemplo de sistema distribuido en **monorepo**: guías publican información en un servicio de registro y los **tours** viven en otro, con bases de datos **H2** independientes, **REST** y un **frontend React + Tailwind** que consume ambos.

## Requisitos

- **JDK 17+**
- **Node.js 20+** (para el frontend)

## Estructura

| Carpeta | Rol |
|---------|-----|
| `tour-service/` | Microservicio de tours: `GET /tours`, `POST /tours` (nombre, ubicación, precio). Puerto **8080**. |
| `guide-service/` | Microservicio de guías: `GET /guides`, `POST /guides`. Puerto **8081**. |
| `frontend/` | SPA Vite + React + Tailwind; en desarrollo usa proxy `/api/tours` y `/api/guides`. |

No hay módulos Java compartidos entre `tour-service` y `guide-service`; cada uno tiene sus capas **model / repository / service / controller**.

## Arranque local (mínimo)

Abre **tres terminales** en la raíz del monorepo (`boat-tours-monorepo`).

**Windows (PowerShell):**

```powershell
.\tour-service\scripts\dev.ps1
```

```powershell
.\guide-service\scripts\dev.ps1
```

```powershell
.\frontend\scripts\dev.ps1
```

Luego abre [http://localhost:5173](http://localhost:5173).

**Linux / macOS:**

```bash
chmod +x tour-service/scripts/*.sh guide-service/scripts/*.sh frontend/scripts/*.sh
./tour-service/scripts/dev.sh
./guide-service/scripts/dev.sh
./frontend/scripts/dev.sh
```

### Probar solo con `curl`

Con `tour-service` en marcha:

```bash
curl -s http://localhost:8080/tours
curl -s -X POST http://localhost:8080/tours -H "Content-Type: application/json" -d "{\"name\":\"Manglar\",\"location\":\"Embarcadero\",\"price\":12000}"
```

## Producción local (fat JAR + preview estático)

Cada servicio puede compilarse y ejecutarse **por separado**:

**Windows:**

```powershell
.\tour-service\scripts\prod.ps1
.\guide-service\scripts\prod.ps1
```

Ejecuta los JAR desde el directorio del servicio para que la carpeta `data/` (H2) quede en el lugar esperado.

Frontend:

```powershell
.\frontend\scripts\prod.ps1
```

(`npm run build` y `npm run preview`; el preview usa el proxy definido en `vite.config.js` si accedes por el mismo host/puerto del preview.)

## Gradle (raíz del monorepo)

```powershell
.\gradlew.bat :tour-service:run
.\gradlew.bat :guide-service:run
.\gradlew.bat :tour-service:shadowJar :guide-service:shadowJar
```

Los artefactos ejecutables son `*-0.1.0-all.jar` bajo `*/build/libs/`.

## GitHub

Crea un repositorio vacío y sube este árbol:

```bash
git init
git add .
git commit -m "Initial import: Micronaut tour and guide microservices with React frontend"
git remote add origin <tu-repo-url>
git push -u origin main
```

## Documentación para revisión (IA)

- **`AGENTS.md`** — contexto de agente, reglas de aislamiento y comandos sugeridos para revisores.
- **`.cursor/rules/boat-tours-monorepo.mdc`** — reglas persistentes para el editor/agente en Cursor.

## Licencia

Código de ejemplo académico; ajusta licencia según tu curso o institución.
