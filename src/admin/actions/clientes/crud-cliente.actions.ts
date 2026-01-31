import { tesloApi } from "@/api/tesloApi";
import type { ApiResponse } from "@/interfaces/api.response";
import type {
  Cliente,
  ClienteCreateUpdateDto,
} from "@/interfaces/cliente.interface";

// api/clienteApi.ts
export const crudClienteAction = {
  // Obtener cliente por ID
  async getById(id: string): Promise<ApiResponse<Cliente>> {
    const { data } = await tesloApi.get<ApiResponse<Cliente>>(
      `/clientes/obtener/${id}`,
    );
    return data;
  },

  // Crear nuevo cliente
  async create(
    clienteData: ClienteCreateUpdateDto,
  ): Promise<ApiResponse<Cliente>> {
    const dataToSend = {
      nombre: clienteData.nombre,
      cedula: clienteData.cedula,
      ruc: clienteData.ruc || null,
      telefono: clienteData.telefono,
      direccion: clienteData.direccion,
      fechaNacimiento: clienteData.fechaNacimiento || null,
      ubicacionGps: clienteData.ubicacionGps || null,
    };
    const { data } = await tesloApi.post<ApiResponse<Cliente>>(
      "/clientes/crear",
      dataToSend,
    );
    return data;
  },

  // Actualizar cliente existente
  async update(
    id: string,
    clienteData: ClienteCreateUpdateDto,
  ): Promise<ApiResponse<Cliente>> {
    // IMPORTANTE: Filtrar solo los campos que la API acepta
    const dataToSend = {
      nombre: clienteData.nombre,
      cedula: clienteData.cedula,
      ruc: clienteData.ruc || null,
      telefono: clienteData.telefono,
      direccion: clienteData.direccion,
      fechaNacimiento: clienteData.fechaNacimiento || null,
      ubicacionGps: clienteData.ubicacionGps || null,
    };

    const { data } = await tesloApi.put<ApiResponse<Cliente>>(
      `/clientes/actualizar/${id}`,
      dataToSend,
    );
    return data;
  },

  // Eliminar cliente
  async delete(id: string): Promise<ApiResponse> {
    const { data } = await tesloApi.delete<ApiResponse>(
      `/clientes/eliminar/${id}`,
    );
    return data;
  },

  // Inactivar cliente
  async inactivate(clienteId: number): Promise<ApiResponse> {
    const { data } = await tesloApi.patch<ApiResponse>("/clientes/inactivar", {
      clienteId,
    });
    return data;
  },

  // Reactivar cliente
  async reactivate(clienteId: number): Promise<ApiResponse> {
    const { data } = await tesloApi.patch<ApiResponse>(
      `/clientes/reactivar/${clienteId}`,
      {},
    );
    return data;
  },
};
