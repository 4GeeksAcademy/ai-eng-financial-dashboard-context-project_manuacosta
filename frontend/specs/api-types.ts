/**
 * Contrato del schema MetricsFacets de la API.
 */
export interface FacetsResponse {
  /** Tipos de operación disponibles. Valores válidos: "income", "outcome". */
  operation_types: ("income" | "outcome")[];

  /** Tipos de negocio disponibles. Valores válidos: "B2B", "B2C". */
  business_types: ("B2B" | "B2C")[];

  /** Categorías disponibles. Valores válidos: "suppliers", "sales", "operational", "administrative", "others". */
  categories: ("suppliers" | "sales" | "operational" | "administrative" | "others")[];

  /** Fecha mínima del rango disponible. Formato: YYYY-MM-DD. */
  min_date: string;

  /** Fecha máxima del rango disponible. Formato: YYYY-MM-DD. */
  max_date: string;
}

/**
 * Contrato del schema MetricsAlert de la API.
 */
export interface AlertEntry {
  /** Período de la alerta; la API no documenta un formato específico. */
  period: string;

  /** Total registrado para outcome en el período. */
  outcome_total: number;

  /** Media de referencia. */
  baseline_average: number;

  /** Razón del incremento (por ejemplo, 0.35); no representa un porcentaje formateado. */
  increase_ratio: number;
}

/**
 * Respuesta del endpoint de alertas: un array de elementos del schema MetricsAlert.
 * Es un alias de tipo porque OpenAPI define la respuesta como array, no como objeto contenedor.
 */
export type AlertsResponse = AlertEntry[];

/**
 * Contrato del schema TopCategoryItem de la API.
 */
export interface CategoryEntry {
  /** Categoría. Valores válidos: "suppliers", "sales", "operational", "administrative", "others". */
  category: "suppliers" | "sales" | "operational" | "administrative" | "others";

  /** Tipo de operación. Valores válidos: "income", "outcome". */
  operation_type: "income" | "outcome";

  /** Importe total de la categoría; la API no documenta límites. */
  total_amount: number;
}

/**
 * Respuesta del endpoint de categorías principales: un array de elementos del schema TopCategoryItem.
 * Es un alias de tipo porque OpenAPI define la respuesta como array, no como objeto contenedor.
 */
export type TopCategoriesResponse = CategoryEntry[];
