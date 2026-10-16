# Hallazgos y reglas propuestas (Fase 2)

Método: el agente del Codespace leyó el repo y propuso hallazgos y reglas. Cada hecho se marcó según lo comprobado a mano: ✅ comprobado, ❓ sin comprobar todavía, ⚠️ en duda.

## Reglas propuestas

### Arquitectura e integración
1. ✅ Al cambiar el nombre del servicio `backend`, actualiza también el destino del proxy de Vite. Hecho: el proxy `/api` apunta a `http://backend:8000` y Compose define el servicio `backend`. (`frontend/vite.config.ts:11-14`, `docker-compose.yml:14`)
2. ✅ Mantén la configuración de FastAPI y del middleware en `main.py` y registra las rutas desde `routes.py`. Hecho: `main.py` crea la app, configura CORS e incluye el router. (`backend/app/main.py:1-14`)
3. ✅ Antes de cambiar la política CORS, revisa sus cuatro parámetros, en especial orígenes y credenciales. Hecho: permite todos los orígenes, métodos y headers, y habilita credenciales. (`backend/app/main.py:7-13`)

### Contratos y naming
4. ❓ Al añadir o modificar valores de operación, categoría o tipo de negocio, actualiza los tipos del backend y del frontend. Hecho: el backend usa `Literal` y el frontend define los mismos conjuntos en TypeScript. (`backend/app/routes.py:11-14`, `frontend/src/lib/financial-types.ts:1-3`)
5. ❓ Al modificar el contrato de movimientos, mantén sincronizados los nombres y formatos de campos en ambos lados. Hecho: `FinancialMovement` comparte campos como `create_date`, `amount` y `operation_type`. (`backend/app/routes.py:22-27`, `frontend/src/lib/financial-types.ts:5-11`)

### Datos y comportamiento
6. ❓ Si se modifica el rango de fechas generado, actualiza también el período que muestra el dashboard y sus pruebas. Hecho: el año se calcula con la fecha actual, pero la interfaz muestra "2024 - Full Year". (`backend/app/routes.py:65-68`, `frontend/src/App.tsx:49`)
7. ❓ Al agrupar fechas en el frontend, verifica el resultado en distintas zonas horarias. Hecho: `computeMonthlyData` crea un `Date` desde `create_date` y usa getters locales. (`frontend/src/lib/financial-utils.ts:7-9,42`)
8. ❓ Evita que generar datos de prueba altere el estado aleatorio global. Hecho: `generate_mock_movements(seed=42)` llama a `random.seed(seed)`. (`backend/app/routes.py:94-96`)

### Testing
9. ❓ Al cambiar filtros o respuestas de la API, añade o ajusta pruebas pytest. Hecho: `test_routes.py` comprueba filtros de fecha, categoría y tipo de operación. (`backend/tests/test_routes.py:36-100`)
10. ❓ Al cambiar cálculos o formatos financieros del frontend, actualiza las pruebas Vitest. Hecho: `financial-utils.test.ts` prueba KPIs, agregación mensual y formateadores. (`frontend/src/lib/financial-utils.test.ts:35-107`)
11. ❓ Si cambia el rango temporal de los datos simulados, añade aserciones sobre ese rango. Hecho: la prueba actual comprueba 360 registros y orden cronológico, pero no fechas concretas. (`backend/tests/test_routes.py:12-16`)

### Documentación y DX
12. ✅ Al cambiar el arranque local, los puertos o el proxy, actualiza los README en inglés y español. Hecho: ambos documentan `docker compose up --build` y las direcciones locales. (`README.md:39-50`, `README.es.md:39-50`). Nota: las líneas de `README.md` no se comprobaron.
13. ⚠️ No documentes pasos que dependan de archivos de configuración inexistentes. Hecho según el agente: `README.es.md` indica copiar `.env.example`, pero ese archivo "no aparece en el workspace". EN DUDA: el mapa del agente en la Fase 1 sí listaba `frontend/.env.example`. (`README.es.md:45-46`)

## Hallazgos filtrados que no pasaron a reglas
- El frontend pide los datos una sola vez y no reintenta si falla (`frontend/src/App.tsx:29`). ❓
- Compose usa `depends_on` sin comprobación de salud del backend (`docker-compose.yml:11-12`). ✅ Cita corregida: el agente dijo la línea 10, que es `- /app/node_modules`.

## Pendiente antes de la Fase 3
- Comprobar los hechos marcados ❓.
- Resolver la regla 13: confirmar si `frontend/.env.example` existe.