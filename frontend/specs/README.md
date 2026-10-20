# Contrato de datos del dashboard

Este documento reúne el contrato de datos para las tres funcionalidades del dashboard. Especifica qué endpoints, parámetros, tipos y estados de interfaz se usan; para props y comportamiento de renderizado completos, consulta `components.md`.

En `frontend/specs`:

- `README.md`: contrato de datos de las tres funcionalidades.
- `api-types.ts`: tipos TypeScript de las respuestas de la API.
- `param-types.ts`: tipos TypeScript de los parámetros de consulta.
- `components.md`: especificación de componentes, props y renderizado condicional.
- `verification.md`: registro de lo comprobado en `/docs`, desajustes y asuntos pendientes de verificación.

## Convenciones generales

- Las fechas usan el formato `YYYY-MM-DD`.
- Los parámetros opcionales vacíos se omiten; no se envían como cadenas vacías.
- Los datos se filtran con el rango **aplicado**, no con valores que el usuario todavía esté editando.
- **Textos con variables:** esta regla se aplica a todos los mensajes con llaves de este README y de `components.md`. `{threshold}` es el valor numérico del input tal cual (por ejemplo, `0.3`); `{businessType}` es `B2B` o `B2C`; `{range}` representa el rango aplicado: con inicio y fin, `del YYYY-MM-DD al YYYY-MM-DD`; solo inicio, `desde YYYY-MM-DD`; solo fin, `hasta YYYY-MM-DD`; ninguno, `todos los datos`. Ejemplo de mensaje completo de alertas vacío con inicio y fin: «No se detectaron anomalías para el umbral 0.3 y el rango aplicado del 2025-10-02 al 2026-09-28.»
- El frontend existente establece la base de URL con `import.meta.env.VITE_API_BASE_URL ?? ""` y hace solicitudes con `fetch` a la ruta concatenada; comprueba `response.ok`, lanza un error si la respuesta no es satisfactoria y convierte la respuesta con `response.json()` (`frontend/src/App.tsx`).
- **VERIFICADO en `/docs`** indica que el contrato se obtuvo del OpenAPI servido, según `verification.md`. **Decisión de la spec/UI** identifica comportamiento decidido para la interfaz y no atribuido al contrato de la API.

## Funcionalidad 1: filtro de rango de fechas

El filtro presenta fecha de inicio y fin, y una referencia al rango disponible. Los cambios se aplican con el botón «Aplicar»; vaciar ambos límites equivale a mostrar todos los datos. Detalles de props y renderizado: `components.md`, sección «Funcionalidad 1».

### Endpoints y tipos

| Endpoint | Petición | Respuesta |
|---|---|---|
| `GET /api/metrics` | `DateRangeFilter` (`frontend/specs/param-types.ts`) | `FinancialMovement[]` (tipo `FinancialMovement` en `frontend/src/lib/financial-types.ts`; campos de respuesta documentados en `verification.md`) |
| `GET /api/metrics/facets` | Sin parámetros query | `FacetsResponse` (`frontend/specs/api-types.ts`) |

`/facets` proporciona `min_date` y `max_date` para la referencia y no recibe fechas.

### Parámetros

| Nombre | Tipo | Obligatorio | Default | Valores válidos y límites | Origen de la regla |
|---|---|---:|---|---|---|
| `start_date` | `string` (fecha) | No | Ninguno documentado | `YYYY-MM-DD`; sin límites documentados | **VERIFICADO en `/docs`**: query opcional de `GET /api/metrics`, sin límites publicados. **Decisión de la spec/UI**: input de inicio opcional; se omite vacío. |
| `end_date` | `string` (fecha) | No | Ninguno documentado | `YYYY-MM-DD`; sin límites documentados | **VERIFICADO en `/docs`**: query opcional de `GET /api/metrics`, sin límites publicados. **Decisión de la spec/UI**: input de fin opcional; se omite vacío. |

**Decisiones de la spec/UI:** ambos límites vacíos significan todos los datos; un único límite deja abierto el rango por el otro lado; los cambios solo filtran datos después de pulsar «Aplicar». El rango disponible mostrado sale de `GET /api/metrics/facets` (`min_date`, `max_date`), no de una solicitud con fechas.

### Casos límite

1. **Ambos inputs vacíos:** al aplicar, se muestran todos los datos y no se envían `start_date` ni `end_date`.
2. **Solo inicio o solo fin:** antes de aplicar, los datos permanecen en el rango ya aplicado; tras aplicar, se muestra desde la fecha de inicio hasta el final de los datos, o desde el principio hasta la fecha de fin, respectivamente, enviando solo el parámetro informado.
3. **Facetas pendientes o con error:** mientras `GET /api/metrics/facets` no responde, la referencia indica que está cargando; si falla, indica que no se pudo cargar el rango disponible.

## Funcionalidad 2: tabla de alertas de anomalías

La tabla presenta las alertas mensuales de gasto anómalo con el umbral configurado y el rango de fechas aplicado en la Funcionalidad 1. El mapeo de campos y la presentación se detallan en `components.md`, sección «Funcionalidad 2».

### Endpoint y tipos

| Endpoint | Petición | Respuesta |
|---|---|---|
| `GET /api/metrics/alerts` | `AlertsParams` (`frontend/specs/param-types.ts`), que extiende `DateRangeFilter` | `AlertsResponse` (`frontend/specs/api-types.ts`), un array de `AlertEntry` del mismo archivo |

### Parámetros

| Nombre | Tipo | Obligatorio | Default | Valores válidos y límites | Origen de la regla |
|---|---|---:|---|---|---|
| `threshold` | `number` | No | `0.3` | **API:** mínimo `0`, sin máximo declarado. **UI:** `0.01`–`1.0`. | **VERIFICADO en `/docs`**: default `0.3`, mínimo `0` y sin máximo declarado. **Decisión de la spec/UI**: input numérico default `0.3`, rango válido `0.01`–`1.0`; fuera del rango no se consulta y se muestra error junto al input, sin corregir el valor en silencio. |
| `start_date` | `string` (fecha) | No | Ninguno documentado | `YYYY-MM-DD`; sin límites documentados | **VERIFICADO en `/docs`**: query opcional. **Decisión de la spec/UI**: se toma de `appliedRange` de la Funcionalidad 1 y se omite si está vacío. |
| `end_date` | `string` (fecha) | No | Ninguno documentado | `YYYY-MM-DD`; sin límites documentados | **VERIFICADO en `/docs`**: query opcional. **Decisión de la spec/UI**: se toma de `appliedRange` de la Funcionalidad 1 y se omite si está vacío. |
| `group_by` | `string` | No | `month` | `day`, `week` o `month` | **VERIFICADO en `/docs`**: parámetro opcional, enum y default `month`. **Decisión de la spec/UI**: no enviarlo y usar ese default; los períodos son mensuales. |

`AlertEntry` contiene `period`, `outcome_total`, `baseline_average` e `increase_ratio`. **Decisión de la spec/UI:** se presentan respectivamente como período, outcome registrado, media móvil de los 3 períodos anteriores e incremento porcentual; `increase_ratio` es una razón y se presenta como porcentaje (por ejemplo, `0.35` como `35 %`). La ventana de tres períodos no está documentada por la API.

### Casos límite

1. **Umbral fuera del rango de UI:** no se consulta `GET /api/metrics/alerts` y se muestra un mensaje de error junto al input.
2. **Respuesta vacía (`[]`):** la tabla permanece visible y muestra «No se detectaron anomalías para el umbral {threshold} y el rango aplicado {range}.»
3. **Carga o error:** durante la solicitud se indica que las alertas están cargando; si falla, se muestra el estado de error de alertas.

## Funcionalidad 3: vista comparativa B2B vs B2C

La vista tiene dos paneles paralelos de categorías principales de ingresos, uno para cada grupo, y un gráfico comparativo debajo. Mantiene un rango aplicado propio; para props y renderizado de página, paneles y gráfico, consulta `components.md`, sección «Funcionalidad 3».

### Endpoints y tipos

| Endpoint | Petición | Respuesta |
|---|---|---|
| `GET /api/metrics/categories/top` — una consulta por grupo | `TopCategoriesParams` (`frontend/specs/param-types.ts`), que extiende `DateRangeFilter` | `TopCategoriesResponse` (`frontend/specs/api-types.ts`), un array de `CategoryEntry` del mismo archivo |
| `GET /api/metrics/facets` — solo referencia de fechas | Sin parámetros query | `FacetsResponse` (`frontend/specs/api-types.ts`) |

### Parámetros de `GET /api/metrics/categories/top`

| Nombre | Tipo | Obligatorio | Default | Valores válidos y límites | Origen de la regla |
|---|---|---:|---|---|---|
| `operation_type` | `"income" \| "outcome"` | No en la API | `outcome` en la API | `income` o `outcome` | **VERIFICADO en `/docs`**: enum y default `outcome`. **Decisión de la spec/UI**: enviar `income`. |
| `limit` | `integer` | No en la API | `5` | **API:** 1–20. | **VERIFICADO en `/docs`**: entero entre 1 y 20, default `5`. **Decisión de la spec/UI**: solicitar exactamente `5`. |
| `business_type` | `"B2B" \| "B2C"` | No en la API | Ninguno documentado | `B2B` o `B2C` | **VERIFICADO en `/docs`**: enum opcional. **Decisión de la spec/UI**: una consulta por grupo, enviando el grupo correspondiente. |
| `start_date` | `string` (fecha) | No | Ninguno documentado | `YYYY-MM-DD`; sin límites documentados | **VERIFICADO en `/docs`**: query opcional. **Decisión de la spec/UI**: usar el rango aplicado propio de esta página y omitirlo si está vacío. |
| `end_date` | `string` (fecha) | No | Ninguno documentado | `YYYY-MM-DD`; sin límites documentados | **VERIFICADO en `/docs`**: query opcional. **Decisión de la spec/UI**: usar el rango aplicado propio de esta página y omitirlo si está vacío. |

**Decisiones de la spec/UI:** ambas consultas usan `operation_type=income`, `limit=5`, y el `business_type` de su grupo. El porcentaje por categoría es su `total_amount` dividido por la suma de `total_amount` de los elementos recibidos de ese grupo; el total del grupo es dicha suma. Si una respuesta contiene menos de cinco elementos, se muestran solo esos. `GET /api/metrics/facets` se usa solo para `min_date` y `max_date`; su campo `categories` general no se usa para poblar los paneles.

### Casos límite

1. **Panel sin resultados:** si un grupo devuelve `[]`, su panel conserva visibles los encabezados y muestra «No hay ingresos de {businessType} en el rango aplicado {range}.» El otro panel decide su estado de forma independiente.
2. **Menos de cinco categorías:** se muestran solo las categorías recibidas, sin filas de relleno y sin tratarlo como error. `sales` y `others` aparecieron para ambos grupos en datos observados en vivo; no es un comportamiento especificado en `/docs`.
3. **Gráfico con grupo vacío:** el grupo vacío cuenta como total `0`; si ambos están vacíos, se muestra «No hay ingresos de B2B ni de B2C en el rango aplicado {range}.» en vez del gráfico.
4. **Carga o error:** si alguna respuesta sigue pendiente, el gráfico muestra carga; si alguna falla, muestra error. Los paneles mantienen sus estados de carga y error propios.

## Desajustes entre el PM y la API

Resumen de `verification.md`, sección 2:

| Desajuste | Qué está verificado en `/docs` | Tratamiento en la spec |
|---|---|---|
| A. Umbral de `0.01` a `1.0` | `threshold` acepta desde `0`, default `0.3`, sin máximo declarado. | `0.01`–`1.0` es una validación de UI, no una restricción de API. |
| B. Media móvil de los 3 períodos anteriores | Solo está documentado `baseline_average`; no está documentada la ventana de tres períodos. | Se puede conservar el rótulo de la columna, pero no atribuir esa ventana a la API. |
| C. Columna «outcome registrado» | El nombre del campo de respuesta es `outcome_total`. | Mapear la columna a `outcome_total`. |
| D. Categorías de cada grupo en `/facets` | `/facets` entrega una lista general `categories`, sin desglose por grupo. | La propuesta de usar `categories/top` por separado con `business_type=B2B` y `business_type=B2C` no está verificada. |

## Pendiente de verificar

- **Funcionalidad 2 / B:** si `baseline_average` corresponde a los tres períodos anteriores (`verification.md`, secciones 2 y 3; también Ambigüedades de Funcionalidad 2 en `components.md`).
- **Funcionalidad 3 / D:** si consultar `GET /api/metrics/categories/top` por separado con `business_type` resuelve la obtención de categorías por grupo (`verification.md`, secciones 2 y 3; también Ambigüedades de Funcionalidad 3 en `components.md`).
- **Funcionalidad 1:** qué ocurre con `editingRange` después de «Aplicar» y cómo se distingue visualmente del rango aplicado; si los límites de fecha de la API son inclusivos o exclusivos (`components.md`, Ambigüedades de Funcionalidad 1).
- **Funcionalidad 2:** qué ocurre si se deja vacío el input del umbral (`components.md`, Ambigüedades de Funcionalidad 2).
- **Funcionalidad 3:** si `categories/top` incluye todas las categorías con ingresos (condición para que la suma devuelta equivalga al total real del grupo) y qué hacer con el porcentaje si la suma de `total_amount` es cero (`components.md`, Ambigüedades de Funcionalidad 3).

## Inconsistencias detectadas

- No se detectaron contradicciones entre `verification.md`, `api-types.ts`, `param-types.ts` y `components.md` para el contenido de este contrato.
- En la Funcionalidad 3, `components.md` indica que el porcentaje se calcula como razón, pero no especifica su precisión ni cómo redondearlo para mostrarlo; un programador tendría que conocer esa decisión.
