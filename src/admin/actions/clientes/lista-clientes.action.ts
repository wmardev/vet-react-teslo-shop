import { tesloApi } from '@/api/tesloApi';
import type { ClientesResponse } from '@/interfaces/clientes.response';
import type { ClientesRequest } from '@/interfaces/clientes.request';

export const listaClientesAction = async (
    requestData: ClientesRequest
): Promise<ClientesResponse> => {
    const { data } = await tesloApi.post<ClientesResponse>('/clientes/listar', requestData);

    return data;
};