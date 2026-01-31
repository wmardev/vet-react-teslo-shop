// hooks/useCliente.ts
import type { ApiResponse } from "@/interfaces/api.response";
import type {
  Cliente,
  ClienteCreateUpdateDto,
} from "@/interfaces/cliente.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crudClienteAction } from "../actions/clientes/crud-cliente.actions";
("@/interfaces/cliente.interface");

export const useCrudCliente = (id: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    ApiResponse<Cliente>,
    Error
  >({
    queryKey: ["cliente", id],
    queryFn: async () => {
      if (id === "new") {
        // Para nuevo cliente, retornamos un objeto vacío
        return {
          ok: true,
          mensaje: "Formulario de nuevo cliente",
          resultado: {
            clienteId: 0,
            nombre: "",
            cedula: "",
            ruc: "",
            telefono: "",
            direccion: "",
            fechaNacimiento: "",
            ubicacionGps: "",
            activo: true,
            fechaCreacion: new Date().toISOString(),
            usuarioCreacion: "",
            fechaMod: new Date().toISOString(),
            usuarioMod: "",
          } as Cliente,
        };
      }
      return crudClienteAction.getById(id);
    },
    retry: 1, // Solo reintentar una vez
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const mutation = useMutation<
    ApiResponse<Cliente>,
    Error,
    ClienteCreateUpdateDto
  >({
    mutationFn: async (clienteData: ClienteCreateUpdateDto) => {
      if (id === "new") {
        return crudClienteAction.create(clienteData);
      } else {
        return crudClienteAction.update(id, clienteData);
      }
    },
    onSuccess: (response) => {
      if (response.ok && response.resultado) {
        // Actualizar la cache del cliente específico
        queryClient.setQueryData(
          ["cliente", id === "new" ? String(response.resultado.clienteId) : id],
          response,
        );

        // Invalidar la cache del listado de clientes
        queryClient.invalidateQueries({ queryKey: ["clientes"] });
      }
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    mutation,
  };
};
