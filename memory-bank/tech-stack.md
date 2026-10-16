# Stack tecnológico

## Lenguajes y frameworks

- El frontend está escrito con React y TypeScript; `package.json` declara `react` `^19.2.4`, `react-dom` `^19.2.4` y `typescript` `~6.0.2`. (`frontend/package.json:1-4,19-20,39`)
- El proyecto de backend usa Python 3.13 en su imagen Docker e instala FastAPI y Uvicorn desde `requirements.txt`; allí no hay versiones fijadas para esas dependencias. (`backend/Dockerfile:1-6`, `backend/requirements.txt:1-6`)
- La aplicación instancia FastAPI y registra rutas desde el módulo `app.routes`. (`backend/app/main.py:1-14`)

## Herramientas de frontend

- Vite se declara en versión `^8.0.4`, el plugin React `^6.0.1` y Vitest `^4.1.4`. (`frontend/package.json:24-42`)
- Tailwind CSS y su plugin para Vite se declaran ambos como `^4.2.2`; también se declaran ESLint `^9.39.4` y PostCSS `^8.5.9`. (`frontend/package.json:16-37`)
- Las dependencias principales de interfaz incluyen Recharts `^3.8.1`, lucide-react `^1.8.0`, clsx `^2.1.1`, class-variance-authority `^0.7.1` y tailwind-merge `^3.5.0`. (`frontend/package.json:16-22`)

## Dependencias de backend

- `requirements.txt` enumera `fastapi`, `uvicorn[standard]`, `debugpy`, `pytest`, `pytest-cov` y `httpx`, sin números de versión. (`backend/requirements.txt:1-6`)
- El Dockerfile de backend instala esas dependencias con pip y ejecuta Uvicorn mediante debugpy con recarga habilitada. (`backend/Dockerfile:1-13`)

## Infraestructura y ejecución local

- Docker Compose construye frontend y backend desde sus respectivos directorios, mapea los puertos `5173`, `8000` y `5678`, y establece `frontend` dependiente de `backend`. (`docker-compose.yml:1-22`)
- La imagen frontend se basa en `node:24-alpine` y ejecuta Vite en el puerto `5173`. (`frontend/Dockerfile:1-12`)
- La imagen backend se basa en `python:3.13-slim`, expone `8000` y `5678` y arranca la API en el puerto `8000`. (`backend/Dockerfile:1-13`)
- El README indica como comando local `docker compose up --build` y documenta frontend en `http://localhost:5173` y backend en `http://localhost:8000`. (`README.md:39-50`, `README.es.md:39-50`)
