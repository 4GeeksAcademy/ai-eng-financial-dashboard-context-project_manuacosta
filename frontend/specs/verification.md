## 1. Qué se verificó y cómo

Backend levantado con Docker Compose. Se leyeron `/docs` y `/openapi.json` en vivo: OpenAPI 3.1.0, “Financial Metrics API”. Se mapearon los endpoints de las tres funcionalidades. Los contratos y parámetros marcados **VERIFICADO en /docs** proceden del OpenAPI servido; las respuestas vacías mencionadas como observadas se probaron en vivo y no están especificadas por `/docs`.

- `GET /api/metrics` — **VERIFICADO en /docs**. Query opcionales: `start_date` y `end_date` (string, formato date; sin default ni límites publicados), `category` (string enum: `suppliers`, `sales`, `operational`, `administrative`, `others`) y `operation_type` (string enum: `income`, `outcome`). Respuesta: array de `FinancialMovement`, con campos requeridos `create_date` (string/date), `amount` (number), `operation_type` (string), `category` (string) y `business_type` (string: `B2B` o `B2C`). Un rango sin coincidencias devolvió `[]` en vivo; no está especificado en `/docs`.
- `GET /api/metrics/facets` — **VERIFICADO en /docs**. Sin parámetros query. Respuesta `MetricsFacets`: `operation_types` (array de string: `income`, `outcome`), `business_types` (array de string: `B2B`, `B2C`), `categories` (array de string: `suppliers`, `sales`, `operational`, `administrative`, `others`), `min_date` y `max_date` (string/date). En vivo devolvió fechas `2025-10-02` y `2026-09-28`; son valores observados, no garantías del contrato.
- `GET /api/metrics/alerts` — **VERIFICADO en /docs**. Query opcionales: `threshold` (number, default `0.3`, mínimo `0`, sin máximo declarado), `group_by` (string enum: `day`, `week`, `month`; default `month`), `start_date` y `end_date` (string/date, sin default ni límites publicados), `business_type` (string enum: `B2B`, `B2C`). Respuesta: array de `MetricsAlert` con `period` (string), `outcome_total`, `baseline_average` e `increase_ratio` (number). Un rango sin coincidencias devolvió `[]` en vivo; `/docs` no define el caso vacío.
- `GET /api/metrics/categories/top` — **VERIFICADO en /docs**. Query opcionales: `operation_type` (string enum: `income`, `outcome`; default `outcome`), `limit` (integer, default `5`, mínimo `1`, máximo `20`), `start_date` y `end_date` (string/date, sin default ni límites publicados), `business_type` (string enum: `B2B`, `B2C`). Respuesta: array de `TopCategoryItem` con `category` (string enum), `operation_type` (string enum) y `total_amount` (number). Un rango sin coincidencias devolvió `[]` en vivo; `/docs` no define el caso vacío.

## 2. Desajustes entre el PM y la API

| afirmación del PM | estado | qué dice la API | cómo se resuelve en la spec |
|---|---|---|---|
| A. “Umbral de 0.01 a 1.0” | ❌ | `threshold`: mínimo `0`, default `0.3`, sin máximo declarado. **VERIFICADO en /docs.** | El rango 0.01–1.0 será regla de validación del input en la UI, no de la API. |
| B. “Media móvil de los 3 períodos anteriores” | ❓ | La API solo expone `baseline_average`; `/docs` no documenta que la ventana sea de tres períodos. | La spec no lo afirma como hecho de la API. |
| C. “Columna ‘outcome registrado’” | ❌ | El campo real de la respuesta es `outcome_total`. **VERIFICADO en /docs.** | La spec usa `outcome_total`. |
| D. “/facets entrega las categorías de cada grupo (B2B y B2C)” | ❌ | `/facets` devuelve una lista general `categories` (array de string), sin desglose por grupo. **VERIFICADO en /docs.** | Propuesta **NO verificada**: obtener categorías por grupo con `GET /api/metrics/categories/top`, usando `business_type=B2B` y `business_type=B2C`. |

## 3. Pendiente de verificar

- **B:** confirmar si `baseline_average` corresponde realmente a los tres períodos anteriores; no tomarlo como hecho hasta confirmarlo.
- **D:** confirmar que la propuesta de consultar `/api/metrics/categories/top` por separado con `business_type=B2B` y `business_type=B2C` resuelve la comparación; no tomarla como hecho hasta confirmarlo.
