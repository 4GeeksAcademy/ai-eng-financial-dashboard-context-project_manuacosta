# Nombre
Contratos y naming

# Alcance
`backend/app/routes.py` y `frontend/src/lib/financial-types.ts`.

# Justificación
4. ❓ Al añadir o modificar valores de operación, categoría o tipo de negocio, actualiza los tipos del backend y del frontend. Hecho: el backend usa `Literal` y el frontend define los mismos conjuntos en TypeScript. (`backend/app/routes.py:11-14`, `frontend/src/lib/financial-types.ts:1-3`)
5. ❓ Al modificar el contrato de movimientos, mantén sincronizados los nombres y formatos de campos en ambos lados. Hecho: `FinancialMovement` comparte campos como `create_date`, `amount` y `operation_type`. (`backend/app/routes.py:22-27`, `frontend/src/lib/financial-types.ts:5-11`)

# Guía
- Al añadir o modificar valores de operación, categoría o tipo de negocio, actualiza los tipos del backend y del frontend.
- Al modificar el contrato de movimientos, mantén sincronizados los nombres y formatos de campos en ambos lados.
