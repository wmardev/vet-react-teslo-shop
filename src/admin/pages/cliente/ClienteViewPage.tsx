import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { useCrudCliente } from "@/admin/hooks/useCrudCliente";
import { ClienteView } from "./ui/ClienteView";

export const ClienteViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useCrudCliente(id || "");

  const handleEdit = () => {
    navigate(`/clientes/${id}/editar`);
  };

  const handleBack = () => {
    navigate("/clientes");
  };

  // Manejo de errores
  if (isError) {
    toast.error("Error al cargar el cliente", {
      position: "top-right",
      duration: 5000,
    });
    return <Navigate to="/clientes" />;
  }

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  if (!data?.ok || !data.resultado) {
    toast.error(data?.mensaje || "Cliente no encontrado", {
      position: "top-right",
      duration: 3000,
    });
    return <Navigate to="/clientes" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <AdminTitle
            title={`Cliente #${data.resultado.clienteId.toString().padStart(3, "0")}`}
            subtitle="Información detallada del cliente"
          />
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Cliente
          </Button>
          <Button variant="outline" onClick={handleBack}>
            Ver todos los clientes
          </Button>
        </div>
      </div>

      {/* Contenido */}
      <ClienteView cliente={data.resultado} />
    </div>
  );
};
