# Nombre
Arquitectura e integración

# Alcance
`frontend/vite.config.ts`, `docker-compose.yml`, `backend/app/main.py` y `backend/app/routes.py`.

# Justificación
1. ✅ Al cambiar el nombre del servicio `backend`, actualiza también el destino del proxy de Vite. Hecho: el proxy `/api` apunta a `http://backend:8000` y Compose define el servicio `backend`. (`frontend/vite.config.ts:11-14`, `docker-compose.yml:14`)
2. ✅ Mantén la configuración de FastAPI y del middleware en `main.py` y registra las rutas desde `routes.py`. Hecho: `main.py` crea la app, configura CORS e incluye el router. (`backend/app/main.py:1-14`)
3. ✅ Antes de cambiar la política CORS, revisa sus cuatro parámetros, en especial orígenes y credenciales. Hecho: permite todos los orígenes, métodos y headers, y habilita credenciales. (`backend/app/main.py:7-13`)

# Guía
- Al cambiar el nombre del servicio `backend`, actualiza también el destino del proxy de Vite.
- Mantén la configuración de FastAPI y del middleware en `main.py` y registra las rutas desde `routes.py`.
- Antes de cambiar la política CORS, revisa sus cuatro parámetros, en especial orígenes y credenciales.
