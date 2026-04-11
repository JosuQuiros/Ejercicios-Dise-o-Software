# E5 — Monolito Django: fiestas (curso)

## Requisitos

- **Python 3.10+** (en Windows, si el comando `python` no existe, usa el launcher: `py -3`)
- **Node.js 18+** y npm (para los dos frontends con Vite)

## Primera vez: entorno y base de datos

Desde la carpeta raíz del proyecto (`E5/`, donde está `requirements.txt`):

**Windows (PowerShell)**

```powershell
cd ruta\a\E5
py -3 -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
cd backend
..\.venv\Scripts\python manage.py migrate
..\.venv\Scripts\python manage.py seed_demo
```

Si en tu sistema `python` ya funciona, puedes usar `python -m venv .venv` en lugar de `py -3 -m venv .venv`.

**Linux / macOS**

```bash
cd ruta/a/E5
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cd backend
../.venv/bin/python manage.py migrate
../.venv/bin/python manage.py seed_demo
```

Datos de ejemplo: el comando `seed_demo` inserta pocas fiestas e invitaciones en SQLite (`backend/db.sqlite3`). Si ya hay datos, no duplica el seed.

**Administración Django (opcional):** desde `backend/`, `..\.venv\Scripts\python manage.py createsuperuser` (Windows) o `../.venv/bin/python manage.py createsuperuser` (Unix). Luego abre `http://127.0.0.1:8000/admin/`.

## Cómo poner a correr el proyecto

Necesitas **tres procesos** a la vez: el backend y los dos frontends. **Arranca primero Django** (puerto 8000); los frontends hacen *proxy* de `/fiestas` hacia ese servidor.

### 1. Servidor Django

**Windows:** en la raíz `E5/`:

```powershell
.\scripts\run-server.ps1
```

**Linux / macOS:**

```bash
chmod +x scripts/run-server.sh
./scripts/run-server.sh
```

Comprueba: [http://127.0.0.1:8000/](http://127.0.0.1:8000/) (SSR) y [http://127.0.0.1:8000/fiestas](http://127.0.0.1:8000/fiestas) (JSON).

### 2. Frontend “invitados” (aceptar solicitudes)

Otra terminal, raíz `E5/`:

```powershell
.\scripts\run-frontend-invitados.ps1
```

Abre [http://127.0.0.1:5173](http://127.0.0.1:5173). La primera vez el script ejecuta `npm install` si falta `node_modules`.

### 3. Frontend “localización” (mapa)

Otra terminal, raíz `E5/`:

```powershell
.\scripts\run-frontend-localizacion.ps1
```

Abre [http://127.0.0.1:5174](http://127.0.0.1:5174).

### Sin scripts (equivalente)

- Backend: `cd backend` y `..\.venv\Scripts\python manage.py runserver 8000` (ajusta la ruta al `python` del venv en Linux/macOS).
- Invitados: `cd frontend-invitados`, `npm install`, `npm run dev`.
- Localización: `cd frontend-localizacion`, `npm install`, `npm run dev`.

## Referencia rápida

| Qué | URL |
|-----|-----|
| Página SSR del monolito | http://127.0.0.1:8000/ |
| Listar fiestas con cupo (`GET`) | http://127.0.0.1:8000/fiestas |
| Crear fiesta (`POST` JSON: `nombre`, `ubicacion`, `capacidad`, opcional `latitud`, `longitud`, `descripcion`) | http://127.0.0.1:8000/fiestas |
| UI aceptar invitados | http://127.0.0.1:5173 |
| UI mapa / listado ubicaciones | http://127.0.0.1:5174 |

## Si algo falla

- **`run-server.ps1` dice que no existe `.venv`:** ejecuta de nuevo la sección “Primera vez” desde la raíz `E5/`.
- **Los frontends no cargan datos:** confirma que Django sigue en **8000** y que abres las UIs por **127.0.0.1** (coincide con CORS y con el proxy de Vite).
- **`npm` no encontrado:** instala [Node.js](https://nodejs.org/) LTS.

## Más documentación

- Uso de IA y notas para la defensa: [docs/AGENTES.md](docs/AGENTES.md).
