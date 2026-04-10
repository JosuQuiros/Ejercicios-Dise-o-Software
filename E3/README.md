# Ejercicio 1 — API tradicional “amantes ideales”

Dos proyectos npm independientes (pueden publicarse como **dos repositorios** en GitHub):

| Carpeta | Rol |
|--------|-----|
| `amantes-backend/` | API REST Express + MongoDB (capas: controller → service → repository → model; DTOs para entrada) |
| `amantes-frontend/` | React (Vite), CSR, capa `src/repositories/` para HTTP |

Documentación para revisión de IA: [`docs/AGENTE_CODING.md`](docs/AGENTE_CODING.md).

## Requisitos locales

- Node.js **18+**
- MongoDB en marcha en `mongodb://127.0.0.1:27017` (sin servicios en la nube)

### Si Vite muestra error al abrir el navegador (ruta con `#`)

Vite **no soporta bien** una carpeta del proyecto cuyo path contenga el carácter **`#`** (por ejemplo `...\E#3\amantes-frontend`). En URLs, `#` indica fragmento y el dev server puede cargar mal los módulos.

**Solución recomendada:** renombrar la carpeta del ejercicio, por ejemplo `E#3` → `E3` o `Ejercicio-3` (sin `#`), y volver a abrir esa carpeta en el editor. El código del repo no cambia; solo la ruta en disco.

**Otro detalle:** si el puerto **5173** está ocupado, Vite usará **5174** (u otro). Abre siempre la URL exacta que imprime la consola (`Local: http://localhost:…`).

## Backend

```bash
cd amantes-backend
cp .env.example .env   # en Windows: copy .env.example .env
npm install
npm run dev            # o npm run start
```

- `POST /amantes` — JSON: `{ "nombre", "edad", "intereses": [] }`
- `GET /amantes?interes=música` — lista perfiles que tengan ese interés (coincidencia exacta, normalizada a minúsculas)

Al arrancar, si la colección está vacía se insertan **4 perfiles** de ejemplo.

## Frontend

Terminal aparte (con el backend ya corriendo):

```bash
cd amantes-frontend
npm install
npm run dev
```

Para el script de entrega `npm run start` (preview de build):

```bash
npm run build
npm run start
```

Con `vite preview`, las peticiones van a `http://127.0.0.1:4000` por defecto (variable opcional `VITE_API_URL` en `.env` del frontend si cambias el puerto).

## Arquitectura en capas (backend)

`routes` → `controllers` → `services` → `repositories` → `models`  
Entrada HTTP validada en `dto/` antes de tocar la lógica de negocio.
