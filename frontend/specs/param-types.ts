/** Parámetros de fecha comunes de GET /api/metrics, GET /api/metrics/alerts y GET /api/metrics/categories/top. */
export interface DateRangeFilter {
  /** Fecha inicial del filtro. Tipo/formato verificado en la API: string date, YYYY-MM-DD. */
  start_date?: string;

  /** Fecha final del filtro. Tipo/formato verificado en la API: string date, YYYY-MM-DD. */
  end_date?: string;
}

/** Parámetros de consulta para GET /api/metrics/alerts. */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral de razón para detectar alertas. Valor válido según la API: number >= 0;
   * default de la API: 0.3; la API no declara máximo.
   * El rango 0.01–1.0 es una regla de validación del input en la UI pedida por el PM,
   * no una restricción de la API.
   */
  threshold?: number;
}

/** Parámetros de consulta para GET /api/metrics/categories/top. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Tipo de operación. Valores válidos: "income" | "outcome". Default de la API: "outcome". */
  operation_type?: "income" | "outcome";

  /** Número máximo de categorías solicitado. Valores válidos: entero entre 1 y 20. Default de la API: 5. */
  limit?: number;

  /** Tipo de negocio. Valores válidos: "B2B" | "B2C". Se incluye porque la comparativa B2B vs B2C necesita una consulta por grupo. */
  business_type?: "B2B" | "B2C";
}
