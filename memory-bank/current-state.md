# Estado actual

## Qué define el código hoy (sin ejecutar la aplicación)

- El backend define `/health` y endpoints de métricas para movimientos, facetas, resúmenes, categorías principales, comparaciones y alertas. (`backend/app/routes.py:231-354`)
- `GET /api/metrics` genera una lista determinista de movimientos simulados con semilla `42`, permite filtros por fecha, categoría y tipo de operación, y ordena la respuesta cronológicamente. (`backend/app/routes.py:79-95,231-243`)
- El frontend solicita `/api/metrics` y, con esa respuesta, calcula cuatro KPI y datos mensuales para dos gráficos. (`frontend/src/App.tsx:13-37,57-66`, `frontend/src/lib/financial-utils.ts:19-60`)
- Los README documentan el arranque con `docker compose up --build` y direcciones locales para frontend y backend. (`README.md:39-50`, `README.es.md:39-50`)

## Huecos conocidos y prioridades documentadas

- Se señala que el encabezado presenta `2024 - Full Year`, mientras que el año de los movimientos simulados se calcula en función de la fecha actual. (`fase-2-hallazgos-y-reglas.md`, regla 6; `backend/app/routes.py:65-68`, `frontend/src/App.tsx:49`)
- Está pendiente comprobar el agrupamiento de fechas del frontend en distintas zonas horarias; la implementación crea objetos `Date` desde `create_date` y usa getters locales. (`fase-2-hallazgos-y-reglas.md`, regla 7; `frontend/src/lib/financial-utils.ts:7-9,42`)
- Está pendiente verificar si `generate_mock_movements(seed=42)` al llamar `random.seed(seed)` modifica el estado aleatorio global. (`fase-2-hallazgos-y-reglas.md`, regla 8; `backend/app/routes.py:94-96`)
- Está pendiente comprobar sincronización de los valores de operación, categoría y tipo de negocio, así como nombres y formatos del contrato de movimientos, entre backend y frontend. (`fase-2-hallazgos-y-reglas.md`, reglas 4-5; `backend/app/routes.py:11-27`, `frontend/src/lib/financial-types.ts:1-11`)
- Como prioridades de verificación de pruebas, el documento propone comprobar pruebas pytest ante cambios en filtros o respuestas, Vitest ante cambios en cálculos o formatos, y cubrir fechas concretas si cambia el rango temporal de datos simulados. (`fase-2-hallazgos-y-reglas.md`, reglas 9-11)
- La sección «Sin verificar» indica que no se comprobaron los comandos de arranque de los Dockerfiles, la ruta de arranque `index.html` → `src/main.tsx`, el árbol de carpetas completo ni el valor efectivo de `VITE_API_BASE_URL`; también deja pendiente confirmar la URL de documentación API al levantar la aplicación. (`verification.md`, sección «Sin verificar»)
- Entre los asuntos pendientes están comprobar los hechos marcados sin verificar y resolver si existe `frontend/.env.example`. (`fase-2-hallazgos-y-reglas.md`, sección «Pendiente antes de la Fase 3»)

## No verificado

- No se ejecutó ni levantó la aplicación como parte de esta documentación; el estado de ejecución actual no está verificado. (no verificado)
