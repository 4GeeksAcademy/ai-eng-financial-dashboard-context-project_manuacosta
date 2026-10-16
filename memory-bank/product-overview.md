# Overview del producto

## Qué es

Financial Metrics Dashboard es una aplicación de panel de métricas financieras con frontend React + TypeScript y backend FastAPI. (`README.md:19`, `README.es.md:18`)

## Qué muestra

- El panel presenta indicadores de ingresos totales, gastos totales, beneficio y margen de beneficio. (`frontend/src/components/dashboard/kpi-row.tsx:9-40`)
- Incluye un gráfico mensual de ingresos frente a gastos y otro de margen de beneficio porcentual. (`frontend/src/components/dashboard/income-outcome-chart.tsx:45-113`, `frontend/src/components/dashboard/profit-percent-chart.tsx:46-115`)
- El encabezado muestra el período literal `2024 - Full Year`. (`frontend/src/App.tsx:49`)

## Cómo se conectan frontend y backend

- Al cargar la aplicación, el frontend solicita `GET /api/metrics`; la URL se compone usando `VITE_API_BASE_URL` o una cadena vacía si no está definida. (`frontend/src/App.tsx:13-21`)
- Si la respuesta es satisfactoria, el frontend calcula los KPI y los datos mensuales con los movimientos recibidos; si falla, muestra un mensaje de error. (`frontend/src/App.tsx:29-39`)
- El backend expone `/api/metrics`, que genera movimientos financieros simulados con semilla `42`, aplica filtros opcionales y devuelve los movimientos en orden cronológico. (`backend/app/routes.py:231-243`)
- En desarrollo local, Vite configura un proxy de `/api` hacia `http://backend:8000`. (`frontend/vite.config.ts:11-14`)
- Compose define servicios `frontend` y `backend`; el primero depende del segundo. (`docker-compose.yml:1-17`)

## Límites de lo comprobado

- El código contiene también rutas de facetas, resúmenes, categorías principales, comparación y alertas; no se verifica aquí que el frontend las consuma. (`backend/app/routes.py:246-354`, `frontend/src/App.tsx:13-21`)
- No se verificó el comportamiento de la aplicación en ejecución. (no verificado)
