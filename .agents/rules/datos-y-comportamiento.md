# Nombre
Datos y comportamiento

# Alcance
`backend/app/routes.py`, `frontend/src/App.tsx` y `frontend/src/lib/financial-utils.ts`.

# Justificación
6. ❓ Si se modifica el rango de fechas generado, actualiza también el período que muestra el dashboard y sus pruebas. Hecho: el año se calcula con la fecha actual, pero la interfaz muestra "2024 - Full Year". (`backend/app/routes.py:65-68`, `frontend/src/App.tsx:49`)
7. ❓ Al agrupar fechas en el frontend, verifica el resultado en distintas zonas horarias. Hecho: `computeMonthlyData` crea un `Date` desde `create_date` y usa getters locales. (`frontend/src/lib/financial-utils.ts:7-9,42`)
8. ❓ Evita que generar datos de prueba altere el estado aleatorio global. Hecho: `generate_mock_movements(seed=42)` llama a `random.seed(seed)`. (`backend/app/routes.py:94-96`)

# Guía
- Si se modifica el rango de fechas generado, actualiza también el período que muestra el dashboard y sus pruebas.
- Al agrupar fechas en el frontend, verifica el resultado en distintas zonas horarias.
- Evita que generar datos de prueba altere el estado aleatorio global.
