export interface PaginationRequest {
  pagina: number;
  limite: number;
}

export interface FiltersRequest {
  search?: string;
  activo?: boolean | string;
  // Agrega más filtros según necesites
}

export interface SortingRequest {
  campo?: string; // 'nombre', 'fechaCreacion', 'clienteId', etc.
  direccion?: 'asc' | 'desc';
}

export interface ClientesRequest {
  paginacion: PaginationRequest;
  filtros?: FiltersRequest;
  ordenamiento?: SortingRequest;
}