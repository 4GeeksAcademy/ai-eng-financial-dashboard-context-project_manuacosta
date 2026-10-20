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

## Skills de agentes

- Skills externas instaladas desde skills.sh y registradas en `skills-lock.json`: `accessibility` (`addyosmani/web-quality-skills`), `vercel-react-best-practices` (`vercel-labs/agent-skills`) y `typescript-advanced-types` (`wshobson/agents`). Quedan en `.agents/skills/`.
- La skill interna `.skills/commit-conventions/SKILL.md` documenta convenciones de commits respaldadas por el historial; ni `memory-bank/` ni `.agents/rules/` definían convenciones de commits.
- Cambios aplicados y verificados:
	- `accessibility`, commit `64d5b18`: títulos de gráficas como `h2`, `role="alert"` y `lang="es"` en el mensaje de error, y título de página `Financial Overview`.
	- `vercel-react-best-practices`, commit `ba4c222`: carga diferida de las dos gráficas con `React.lazy` y `Suspense`, adaptando la regla `bundle-dynamic-imports` de `next/dynamic` a Vite. El build dejó de advertir por chunks mayores de 500 kB (antes, un JS de 584 kB) y los 5 tests pasan.
	- `typescript-advanced-types`, commit `e158e36`: los tipos duplicados del tooltip de las dos gráficas pasaron a un archivo compartido (`chart-tooltip-types.ts`); cambio solo de tipos.
- Skill extra elegida: `typescript-advanced-types`. Se comparó con `webapp-testing`. Se eligió porque las tres auditorías de skills.sh (Gen Agent Trust Hub, Socket y Snyk) dieron Pass, no pide instalar ni ejecutar nada y el proyecto usa TypeScript estricto. `webapp-testing` quedó descartada porque requiere Playwright en Python y scripts, Socket y Snyk marcan Warn, y la app no carga datos en este entorno. La skill está pensada para tipos avanzados y en este repo solo hubo un cambio pequeño; no se atribuye al cambio un patrón concreto de la skill.
- Las reglas `server-*` y las específicas de Next.js de Vercel no aplican porque el frontend es Vite.
- Falla conocida del entorno, no causada por estos cambios: el proxy de Vite dentro de Docker no alcanza al backend (`connect ETIMEDOUT`); está documentada en `verification.md` (commit `abb49b8`).
