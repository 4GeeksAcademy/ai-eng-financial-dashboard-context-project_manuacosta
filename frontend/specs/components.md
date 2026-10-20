# Especificación de componentes

## Funcionalidad 1: filtro de rango de fechas

### Reglas de la funcionalidad

- El filtro se coloca en la parte superior del dashboard, cerca del encabezado, y contiene dos inputs de fecha: inicio y fin. El rango aplicado filtra todos los datos mostrados en el dashboard.
- El usuario aplica los cambios de los inputs mediante un botón «Aplicar». Cambiar las fechas no actualiza los datos por sí solo; al pulsar el botón, el rango que se está editando pasa a ser el aplicado y se actualizan todos los datos mostrados. Esta es una decisión de la especificación, no una regla de la API.
- Ambos inputs son opcionales. Si los dos están vacíos, se muestran todos los datos y no se envían `start_date` ni `end_date` a la API.
- Si solo se completa el input de inicio, el filtro queda abierto por el otro lado: se muestran los datos desde esa fecha hasta el final de los datos. Se envía solo `start_date`.
- Si solo se completa el input de fin, el filtro queda abierto por el otro lado: se muestran los datos desde el principio de los datos hasta esa fecha. Se envía solo `end_date`.
- El comportamiento de rango abierto de un solo lado es una regla de esta especificación, no una regla atribuida a la API. La API acepta `start_date` y `end_date` de forma independiente.
- Si se completan ambos inputs, se envían ambos parámetros. Los parámetros vacíos se omiten; no se envían como cadenas vacías.
- El formato de las fechas y de los parámetros enviados es `YYYY-MM-DD`.
- Cerca de los inputs se muestra, como referencia, el rango disponible del dataset: fecha más antigua (`min_date`) y fecha más reciente (`max_date`). Este rango no cambia al seleccionar fechas.

### Componente propuesto: `DashboardDateRangeFilter`

**Responsabilidad:** presentar los dos inputs, el botón «Aplicar» y la referencia del rango disponible. Distingue el rango que el usuario está editando del rango ya aplicado al que corresponden los datos mostrados.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `appliedRange` | `DateRangeFilter` | Rango actualmente aplicado, al que corresponden los datos mostrados. `start_date` y `end_date` son opcionales; si faltan o están vacíos, ese límite no se envió. |
| `editingRange` | `DateRangeFilter` | Rango que se está editando en los inputs y que todavía no afecta los datos mostrados hasta pulsar «Aplicar». Los límites son opcionales. |
| `onEditingRangeChange` | `(range: DateRangeFilter) => void` | Comunica los cambios de los inputs sin aplicarlos. Los valores no vacíos usan `YYYY-MM-DD`; los vacíos se omiten del rango comunicado. |
| `onApply` | `(range: DateRangeFilter) => void` | Se invoca al pulsar «Aplicar» con el rango editado para que pase a ser el rango aplicado y se actualicen los datos. Los límites vacíos se omiten. |
| `facets` | `FacetsResponse \| null` | Respuesta de facetas recibida, que contiene `min_date` y `max_date` para la referencia. Es `null` mientras no haya una respuesta disponible. |
| `facetsLoading` | `boolean` | Indica que la solicitud de facetas está pendiente. |
| `facetsError` | `boolean` | Indica que falló la solicitud de facetas. |

Se reutilizan `DateRangeFilter` de `frontend/specs/param-types.ts` y `FacetsResponse` de `frontend/specs/api-types.ts`. No se proponen tipos nuevos.

**Renderizado condicional:**

- En todos los estados se muestran los dos inputs, identificados como fecha de inicio y fecha de fin, y el botón «Aplicar».
- Los inputs muestran el `editingRange`. Mientras el usuario edita sin pulsar «Aplicar», los datos mostrados siguen correspondiendo al `appliedRange`; los cambios de los inputs no los actualizan.
- Con ambos límites del `editingRange` vacíos, al pulsar «Aplicar» no hay filtro de fechas y se muestran todos los datos.
- Con un solo límite del `editingRange` lleno, antes de aplicar se muestra y comunica únicamente ese límite en edición y los datos siguen correspondiendo al `appliedRange`. Al pulsar «Aplicar», el rango queda abierto por el lado del input vacío: solo inicio muestra desde esa fecha hasta el final de los datos y solo fin desde el principio de los datos hasta esa fecha.
- Con ambos límites del `editingRange` llenos, antes de aplicar se muestran y comunican ambos límites en edición y los datos siguen correspondiendo al `appliedRange`. Al pulsar «Aplicar», ambos límites pasan a filtrar los datos.
- Mientras `facetsLoading` sea `true`, la referencia indica que el rango disponible está cargando; no muestra fechas de rango como si ya se hubieran recibido.
- Si `facetsError` es `true`, la referencia indica que no se pudo cargar el rango disponible.
- Si la solicitud ya no está cargando, no ha fallado y `facets` es `null`, la referencia indica que el rango disponible no está disponible. Cuando `facets` contiene una respuesta, la referencia muestra `min_date` como fecha más antigua y `max_date` como fecha más reciente, en formato `YYYY-MM-DD`.

**Endpoints de datos (verificados en `frontend/specs/verification.md`):**

- `GET /api/metrics`: origen de los movimientos financieros que alimentan los datos mostrados actualmente por el dashboard. Recibe opcionalmente `start_date` y `end_date`. Se envían solo los límites no vacíos; sin fechas, se solicitan todos los datos.
- `GET /api/metrics/facets`: origen de la referencia del rango disponible, mediante `min_date` y `max_date` de `FacetsResponse`. Este endpoint no recibe parámetros de fecha.

### Ambigüedades

- No está definido qué ocurre con el `editingRange` después de pulsar «Aplicar» ni cómo se representa visualmente la diferencia entre el rango editado y el aplicado mientras hay cambios sin aplicar.
- `verification.md` confirma los parámetros de fecha de `GET /api/metrics`, pero no documenta si los límites de fecha de la API son inclusivos o exclusivos. Esta especificación no decide esa semántica.

## Funcionalidad 2: tabla de alertas de anomalías

### Reglas de la funcionalidad

- Debajo de los gráficos existentes se muestra una tabla con los períodos en los que el gasto subió de forma inesperada. La tabla tiene cuatro columnas: período, outcome registrado, media móvil de los 3 períodos anteriores e incremento porcentual.
- La columna «Media móvil de los 3 períodos anteriores» usa `baseline_average` como dato. La mención de los tres períodos anteriores es un rótulo de la interfaz, no una afirmación sobre el cálculo realizado por la API.
- El mapeo de columnas a `AlertEntry` es: período = `period`; outcome registrado = `outcome_total`; media móvil = `baseline_average`; incremento porcentual = `increase_ratio`.
- `increase_ratio` es una razón (por ejemplo, `0.35`). Mostrarla como porcentaje (por ejemplo, `35 %`) es una regla de presentación de la UI, no un formato documentado por la API.
- El umbral se configura con un input numérico cuyo valor por defecto es `0.3`. El rango válido en la UI es de `0.01` a `1.0`; esta es una regla de validación de pantalla, no de la API, que acepta valores desde `0` y no documenta máximo.
- Si el umbral está fuera del rango `0.01`–`1.0`, la pantalla no consulta la API y muestra un mensaje de error junto al input. El valor no se corrige en silencio.
- La consulta usa `GET /api/metrics/alerts` con `threshold` y los límites no vacíos de `appliedRange` de la Funcionalidad 1. No usa el rango que todavía se está editando.
- No se envía `group_by`; se usa el default `month` de la API, por lo que los períodos son mensuales.
- Si ambos límites de `appliedRange` están vacíos, se omiten `start_date` y `end_date`; si solo uno está informado, se envía solo ese parámetro. No se envían parámetros vacíos.
- Si la API devuelve `[]`, la tabla permanece visible y muestra este mensaje explícito: «No se detectaron anomalías para el umbral {threshold} y el rango aplicado {range}.» Para `{range}`, se indica el rango de fechas aplicado, o «todos los datos» cuando ambos límites aplicados están vacíos.

### Componente propuesto: `AnomalyAlertsTable`

**Responsabilidad:** mostrar y configurar las alertas de anomalías debajo de los gráficos, usando el rango de fechas aplicado en el dashboard.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `threshold` | `AlertsParams["threshold"]` | Umbral actual del input. El valor inicial por defecto es `0.3`; se reutiliza el tipo de la propiedad `threshold` de `AlertsParams`. |
| `onThresholdChange` | `(threshold: AlertsParams["threshold"]) => void` | Comunica el valor editado del umbral. |
| `appliedRange` | `DateRangeFilter` | Rango aplicado por la Funcionalidad 1, usado para la consulta y para identificar el rango en el mensaje de estado vacío. No usa `editingRange`. |
| `data` | `AlertsResponse \| null` | Respuesta de alertas. Cada elemento es un `AlertEntry`; `null` indica que aún no hay respuesta disponible. |
| `loading` | `boolean` | Indica que la solicitud de alertas está pendiente. |
| `error` | `boolean` | Indica que falló la solicitud de alertas. |

Se reutilizan `AlertsParams` y `DateRangeFilter` de `frontend/specs/param-types.ts`, y `AlertsResponse` y `AlertEntry` de `frontend/specs/api-types.ts`. No se proponen tipos nuevos.

**Renderizado condicional:**

- El componente muestra el input numérico de umbral y la tabla con sus cuatro columnas. Junto al input muestra un mensaje de error cuando el umbral no está dentro de `0.01`–`1.0`.
- Con un umbral válido y datos, muestra una fila por cada `AlertEntry`, mapeando sus campos a las columnas indicadas. Presenta `increase_ratio` como porcentaje, multiplicado por 100 y con el símbolo `%`.
- Con un umbral válido y `data` igual a `[]`, mantiene la tabla y sus encabezados visibles y muestra el mensaje: «No se detectaron anomalías para el umbral {threshold} y el rango aplicado {range}.»
- Mientras `loading` sea `true`, indica que las alertas están cargando.
- Si `error` es `true`, muestra un estado de error para las alertas.
- Si el umbral está fuera de rango, muestra el mensaje de error junto al input y no consulta el endpoint de alertas.

**Endpoint de datos (verificado en `frontend/specs/verification.md`):**

- `GET /api/metrics/alerts`: recibe `threshold` y, cuando están presentes en `appliedRange`, `start_date` y `end_date`. No recibe `group_by` en esta funcionalidad; se conserva el default mensual de la API. Su respuesta `AlertsResponse` es un array de `AlertEntry`.

### Ambigüedades

- `verification.md` indica que `/docs` no documenta si `baseline_average` se calcula como la media móvil de los tres períodos anteriores. Esa ventana no está verificada.
- No está definido cómo se maneja el input si el usuario lo deja vacío; no se decide aquí si conserva el default, queda sin valor o produce otro resultado.

## Funcionalidad 3: vista comparativa B2B vs B2C

### Reglas de la funcionalidad

- La funcionalidad es una página nueva del dashboard para comparar ingresos B2B y B2C. Incluye dos secciones en paralelo, una por grupo, y debajo de ambas un único gráfico que compara sus totales de ingresos.
- Cada sección muestra una tabla con hasta cinco categorías principales de ingreso del grupo, con estas columnas: nombre de categoría, total de ingresos y porcentaje sobre el total del grupo.
- Para cada grupo se hace una consulta independiente a `GET /api/metrics/categories/top` con `operation_type=income`, `limit=5` y `business_type=B2B` o `business_type=B2C`. Se incluyen `start_date` y `end_date` solo si están informados en el rango aplicado.
- `GET /api/metrics/facets` se usa solo para la referencia de rango disponible (`min_date` y `max_date`), igual que en la Funcionalidad 1. `FacetsResponse.categories` es una lista general sin desglose por grupo y no se usa para formar las categorías de las tablas. Las categorías por grupo proceden de la respuesta de `categories/top` con `business_type`; esta solución no está verificada, según el desajuste D de `verification.md`.
- El filtro de fechas reutiliza `DashboardDateRangeFilter` de la Funcionalidad 1: incluye el botón «Aplicar», admite un solo límite con el rango abierto por el otro lado y omite parámetros de fecha vacíos. Esta página mantiene su propio rango aplicado, independiente del dashboard principal. Las consultas de esta página usan ese rango aplicado y no el rango que esté en edición.
- La API no devuelve el total de ingresos del grupo. Para cada grupo, el total y los porcentajes se calculan a partir de los elementos recibidos: total del grupo = suma de `total_amount`; porcentaje de una categoría = `total_amount` de esa categoría dividido por la suma de `total_amount` de las categorías recibidas para el grupo. Este cálculo es una regla de esta especificación.
- Si una consulta devuelve menos de cinco elementos, se muestran solo los elementos recibidos; no se agregan filas de relleno y el resultado no se considera un error. En datos observados en vivo, las respuestas de ingresos de ambos grupos contenían solo `sales` y `others`; este dato es observado, no especificado en `/docs`.
- Si la respuesta de un grupo es `[]`, su panel permanece visible con los encabezados de la tabla y muestra el mensaje «No hay ingresos de {businessType} en el rango aplicado {range}.» Cada panel determina su estado vacío de forma independiente. `{range}` identifica las fechas aplicadas, o indica «todos los datos» si ambos límites están vacíos.
- El gráfico usa los totales de ingresos B2B y B2C calculados según la regla anterior y necesita las respuestas de ambos grupos. Si alguna consulta sigue pendiente, muestra su estado de carga. Si alguna consulta falla, muestra un estado de error del gráfico; el otro panel conserva su propio estado y sus datos. Un grupo vacío cuenta como total `0`. Si ambos grupos están vacíos, se muestra «No hay ingresos de B2B ni de B2C en el rango aplicado {range}.» en lugar del gráfico.

### Componente propuesto: `B2BvsB2CComparisonPage`

**Responsabilidad:** componer el filtro de fechas propio de esta página, los paneles B2B y B2C y el gráfico comparativo, manteniendo el rango aplicado de esta vista separado del dashboard principal.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `appliedRange` | `DateRangeFilter` | Rango aplicado propio de esta página y usado en las consultas de ambos grupos. |
| `editingRange` | `DateRangeFilter` | Rango que se está editando en el filtro reutilizado; no se usa en consultas hasta aplicar. |
| `onEditingRangeChange` | `(range: DateRangeFilter) => void` | Comunica cambios en los inputs del filtro. |
| `onApply` | `(range: DateRangeFilter) => void` | Aplica el rango editado a esta página. |
| `facets` | `FacetsResponse \| null` | Respuesta de facetas para la referencia del rango disponible. |
| `facetsLoading` | `boolean` | Indica que la solicitud de facetas está pendiente. |
| `facetsError` | `boolean` | Indica que falló la solicitud de facetas. |
| `b2bData` | `TopCategoriesResponse \| null` | Respuesta de categorías de ingresos B2B; `null` indica que aún no hay respuesta. |
| `b2bLoading` | `boolean` | Estado de carga de la consulta B2B. |
| `b2bError` | `boolean` | Estado de error de la consulta B2B. |
| `b2cData` | `TopCategoriesResponse \| null` | Respuesta de categorías de ingresos B2C; `null` indica que aún no hay respuesta. |
| `b2cLoading` | `boolean` | Estado de carga de la consulta B2C. |
| `b2cError` | `boolean` | Estado de error de la consulta B2C. |

Se reutilizan `TopCategoriesParams`, `DateRangeFilter` y `FacetsResponse`. No se proponen tipos nuevos. `TopCategoriesResponse` y `CategoryEntry` tipan las respuestas y sus elementos.

**Renderizado condicional:**

- Muestra `DashboardDateRangeFilter` con el rango de edición, el rango aplicado y la referencia de facetas; sigue el comportamiento de aplicación descrito en Funcionalidad 1.
- Muestra en paralelo `BusinessIncomeCategoryPanel` para B2B y B2C, cada uno con su respuesta y estados independientes.
- Muestra debajo de ambos paneles un único `BusinessIncomeComparisonChart`, alimentado con las respuestas de los dos grupos y sus estados de carga y error.

**Endpoints de datos:**

- Para las categorías, esta página usa dos consultas independientes a `GET /api/metrics/categories/top`, una por cada grupo, con los parámetros indicados en las reglas. La respuesta de cada consulta se representa mediante `TopCategoriesResponse` (`CategoryEntry[]`).
- Para las fechas de referencia usa `GET /api/metrics/facets`, que no recibe parámetros de fecha y devuelve `min_date` y `max_date` en `FacetsResponse`.

### Componente propuesto: `BusinessIncomeCategoryPanel`

**Responsabilidad:** presentar la tabla de categorías de ingreso y el total calculado para un único grupo de negocio.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `businessType` | `NonNullable<TopCategoriesParams["business_type"]>` | Grupo de negocio del panel: `B2B` o `B2C`. |
| `data` | `TopCategoriesResponse \| null` | Categorías recibidas para ese grupo; cada elemento es un `CategoryEntry`. |
| `loading` | `boolean` | Indica que la consulta de este grupo está pendiente. |
| `error` | `boolean` | Indica que falló la consulta de este grupo. |
| `appliedRange` | `DateRangeFilter` | Rango aplicado de esta página, usado para el texto del estado vacío. |

**Renderizado condicional:**

- En el estado con datos muestra el nombre de cada `category`, su `total_amount` como total de ingresos de esa categoría y su porcentaje calculado con el total de ingresos de ese grupo. Muestra hasta los cinco elementos recibidos, sin filas de relleno.
- Si `data` es `[]`, mantiene visibles el panel y los encabezados de las columnas «Categoría», «Total de ingresos» y «Porcentaje sobre el total del grupo», y muestra «No hay ingresos de {businessType} en el rango aplicado {range}.»
- Mientras `loading` sea `true`, muestra el estado de carga propio del panel.
- Si `error` es `true`, muestra el estado de error propio del panel.
- El panel deriva su estado solo de su propia respuesta, carga y error; el estado del otro grupo no determina si este panel muestra datos o estado vacío.

**Endpoint de datos:**

- Una consulta por panel a `GET /api/metrics/categories/top`, con `operation_type=income`, `limit=5`, el `business_type` del panel y los límites no vacíos de `appliedRange`. No se usa `FacetsResponse.categories` para poblar el panel.

### Componente propuesto: `BusinessIncomeComparisonChart`

**Responsabilidad:** comparar en un solo gráfico los totales de ingresos calculados para B2B y B2C.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `b2bData` | `TopCategoriesResponse \| null` | Categorías devueltas para B2B, usadas para calcular el total del grupo. |
| `b2cData` | `TopCategoriesResponse \| null` | Categorías devueltas para B2C, usadas para calcular el total del grupo. |
| `b2bLoading` | `boolean` | Indica que la consulta B2B sigue pendiente. |
| `b2cLoading` | `boolean` | Indica que la consulta B2C sigue pendiente. |
| `b2bError` | `boolean` | Indica que falló la consulta B2B. |
| `b2cError` | `boolean` | Indica que falló la consulta B2C. |
| `appliedRange` | `DateRangeFilter` | Rango aplicado de esta página, usado en el mensaje si ambos grupos están vacíos. |

**Renderizado condicional:**

- Cuando hay respuesta de ambos grupos y al menos una contiene elementos, muestra el gráfico comparativo con los totales de ingresos calculados sumando `total_amount` por grupo. Si una respuesta es `[]`, representa el total de ese grupo como `0`.
- Si ambas respuestas son `[]`, no muestra el gráfico y presenta «No hay ingresos de B2B ni de B2C en el rango aplicado {range}.»
- Mientras cualquiera de las dos consultas esté pendiente, muestra el estado de carga del gráfico.
- Si cualquiera de las dos consultas falla, muestra el estado de error del gráfico.

**Endpoint de datos:**

- El gráfico no requiere una consulta propia. Consume las respuestas de las dos consultas a `GET /api/metrics/categories/top` descritas para los paneles; ambas usan el rango aplicado de esta página.

### Ambigüedades

- La propuesta de obtener las categorías de cada grupo mediante `GET /api/metrics/categories/top` con `business_type` no está verificada (desajuste D de `verification.md`).
- El total calculado con los elementos devueltos equivale al total real del grupo solo si la respuesta incluye todas las categorías con ingresos. Que `categories/top` devuelva todas esas categorías no está verificado en `/docs`.
- En el contrato consultado no se define el resultado de calcular porcentajes si la suma de `total_amount` del grupo es cero.
