import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import type { Cliente, ClienteCreateUpdateDto } from "@/interfaces/cliente.interface";
import { useCrudCliente } from "@/admin/hooks/useCrudCliente";
import { ClienteForm } from "./ui/ClienteForm";

export const ClienteEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, mutation } = useCrudCliente(id || "");

  const handleSubmit = async (clienteLike: Partial<Cliente>) => {
    try {
      // Crear DTO específico para la API
      const dataToSubmit: ClienteCreateUpdateDto = {
        nombre: clienteLike.nombre || "",
        cedula: clienteLike.cedula || "",
        ruc: clienteLike.ruc || undefined,
        telefono: clienteLike.telefono || "",
        direccion: clienteLike.direccion || "",
        fechaNacimiento: clienteLike.fechaNacimiento || "",
        ubicacionGps: clienteLike.ubicacionGps || ""
      };

      await mutation.mutateAsync(dataToSubmit, {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success(response.mensaje, {
              position: "top-right",
              duration: 3000,
            });
            navigate(`/admin/clientes/${id}`);
          } else {
            toast.error(response.mensaje || "Error al actualizar el cliente", {
              position: "top-right",
              duration: 5000,
            });
          }
        },
        onError: (error) => {
          toast.error(error.message || "Error al procesar la solicitud", {
            position: "top-right",
            duration: 5000,
          });
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Error al procesar la solicitud", {
        position: "top-right",
        duration: 5000,
      });
    }
  };

  const handleCancel = () => {
    navigate(`/admin/clientes/${id}`);
  };

  // Manejo de errores
  if (isError) {
    toast.error("Error al cargar el cliente", {
      position: "top-right",
      duration: 5000,
    });
    return <Navigate to="/admin/clientes" />;
  }

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  if (!data?.ok || !data.resultado) {
    toast.error(data?.mensaje || "Cliente no encontrado", {
      position: "top-right",
      duration: 3000,
    });
    return <Navigate to="/admin/clientes" />;
  }

  return (
    <ClienteForm
      cliente={data.resultado}
      mode="edit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={mutation.isPending}
      serverError={data && !data.ok ? data.mensaje : undefined}
    />
  );
};
