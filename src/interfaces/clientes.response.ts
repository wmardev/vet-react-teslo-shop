import type { Cliente } from "./cliente.interface";

export interface Pagination {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
}

export interface ClientesResponse {
    ok: boolean;
    mensaje: string;
    resultado: {
        data: Cliente[];
        paginacion: Pagination;
    };
}