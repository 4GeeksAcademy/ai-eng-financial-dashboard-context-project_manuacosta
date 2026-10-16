# Nombre
Testing

# Alcance
`backend/tests/test_routes.py` y `frontend/src/lib/financial-utils.test.ts`.

# Justificación
9. ❓ Al cambiar filtros o respuestas de la API, añade o ajusta pruebas pytest. Hecho: `test_routes.py` comprueba filtros de fecha, categoría y tipo de operación. (`backend/tests/test_routes.py:36-100`)
10. ❓ Al cambiar cálculos o formatos financieros del frontend, actualiza las pruebas Vitest. Hecho: `financial-utils.test.ts` prueba KPIs, agregación mensual y formateadores. (`frontend/src/lib/financial-utils.test.ts:35-107`)
11. ❓ Si cambia el rango temporal de los datos simulados, añade aserciones sobre ese rango. Hecho: la prueba actual comprueba 360 registros y orden cronológico, pero no fechas concretas. (`backend/tests/test_routes.py:12-16`)

# Guía
- Al cambiar filtros o respuestas de la API, añade o ajusta pruebas pytest.
- Al cambiar cálculos o formatos financieros del frontend, actualiza las pruebas Vitest.
- Si cambia el rango temporal de los datos simulados, añade aserciones sobre ese rango.
