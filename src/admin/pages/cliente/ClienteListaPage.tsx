import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useClientes } from "@/admin/hooks/useClientes";
import {
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ArrowUpDown,
  FilterX,
  UserPlus,
  Trash2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Paginacion } from "@/components/custom/Paginacion";
import type { ClientesResponse } from "@/interfaces/clientes.response";
import { tesloApi } from "@/api/tesloApi";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Función para inactivar cliente
const inactivateCliente = async (clienteId: number) => {
  try {
    const { data } = await tesloApi.patch("/clientes/inactivar", {
      clienteId,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const ClienteListaPage = () => {
  const { data, isLoading, isError, error, refetch } = useClientes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [isInactivating, setIsInactivating] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [clienteToInactivate, setClienteToInactivate] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  // Debug: Verificar estructura de datos
  console.log("Datos recibidos:", data);
  console.log("Estructura completa:", data?.resultado);

  // Inicializar search input desde URL
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchInput(currentSearch);
  }, []);

  // Configurar filtro por defecto para mostrar solo activos
  useEffect(() => {
    if (!searchParams.has("activo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("activo", "true");
      setSearchParams(newParams, { replace: true });
    }
  }, []);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);

    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
      newParams.set("page", "1"); // Resetear a primera página al buscar
    } else {
      newParams.delete("search");
    }

    // Mantener el filtro de activos
    if (!newParams.has("activo")) {
      newParams.set("activo", "true");
    }

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams(
      new URLSearchParams({
        page: "1",
        limit: searchParams.get("limit") || "5",
        activo: "true", // Siempre mostrar solo activos
      }),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSort = (field: string) => {
    const currentField = searchParams.get("sortField") || "nombre";
    const currentDir = searchParams.get("sortDir") || "asc";

    const newDir =
      currentField === field && currentDir === "asc" ? "desc" : "asc";

    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortField", field);
    newParams.set("sortDir", newDir);
    // Mantener el filtro de activos
    if (!newParams.has("activo")) {
      newParams.set("activo", "true");
    }
    setSearchParams(newParams);
  };

  const renderSortIcon = (field: string) => {
    const currentField = searchParams.get("sortField") || "nombre";
    const currentDir = searchParams.get("sortDir") || "asc";

    if (currentField === field) {
      return (
        <ArrowUpDown
          className={`w-4 h-4 ml-1 ${currentDir === "asc" ? "rotate-180" : ""}`}
        />
      );
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return "Sin teléfono";

    // Formato: 0985-234567 → (0985) 234-567
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const confirmInactivate = (clienteId: number, nombre: string) => {
    setClienteToInactivate({ id: clienteId, nombre });
    setShowConfirmDialog(true);
  };

  const handleInactivate = async () => {
    if (!clienteToInactivate) return;

    const { id, nombre } = clienteToInactivate;
    setIsInactivating(id);

    try {
      const response = await inactivateCliente(id);

      console.log("Respuesta de inactivar:", response); // Para debug

      // Verificar estructura de respuesta (ok: true/false)
      if (response?.ok === true) {
        toast.success(
          response.mensaje || `Cliente "${nombre}" inactivado correctamente`,
          {
            position: "top-right",
            duration: 3000,
          },
        );

        // Refrescar la lista forzando nueva petición
        await refetch();

        // También recargar la página actualizando parámetros
        const currentPage = searchParams.get("page") || "1";
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", currentPage);
        newParams.set("activo", "true");
        // Forzar actualización con timestamp
        newParams.set("_t", Date.now().toString());
        setSearchParams(newParams);
      } else {
        // Manejar respuesta con ok: false
        const errorMessage =
          response?.mensaje || "Error al inactivar el cliente";
        toast.error(errorMessage, {
          position: "top-right",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Error detallado:", error);

      // Manejar diferentes tipos de error
      let errorMessage = "Error al inactivar el cliente";

      if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        duration: 5000,
      });
    } finally {
      setIsInactivating(null);
      setClienteToInactivate(null);
      setShowConfirmDialog(false);
    }
  };

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          Error al cargar clientes: {error?.message || "Error desconocido"}
        </div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  // ✅ CORREGIDO: Acceder a la estructura correcta según la interfaz
  const response = data as ClientesResponse | undefined;
  const clients = response?.resultado?.data || [];
  const pagination = response?.resultado?.paginacion || {
    pagina: 1,
    limite: 5,
    total: 0,
    totalPaginas: 0,
  };

  const hasFilters = searchParams.get("search");

  return (
    <div className="space-y-6">
      {/* Alert Dialog para confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              ¿Inactivar cliente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Está a punto de inactivar al cliente{" "}
              <span className="font-semibold text-blue-600">
                "{clienteToInactivate?.nombre}"
              </span>
              .
              <br />
              <br />
              Esta acción:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Cambiará el estado del cliente a "Inactivo"</li>
                <li>
                  El cliente ya no aparecerá en esta lista (solo se muestran
                  activos)
                </li>
                <li>Puede ser reactivado posteriormente si es necesario</li>
              </ul>
              <br />
              ¿Desea continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setClienteToInactivate(null);
                setShowConfirmDialog(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleInactivate}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isInactivating !== null}
            >
              {isInactivating !== null ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Inactivando...
                </>
              ) : (
                "Sí, inactivar cliente"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AdminTitle
          title="Gestión de Clientes"
          subtitle="Administra el listado de clientes del sistema"
        />

        <div className="flex gap-3">
          <Link to="/admin/clientes/new">
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros - MODIFICADO */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-6">
          {/* Búsqueda - ocupa la mitad izquierda */}
          <div className="w-full">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, cédula, RUC o teléfono..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10 w-full"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Botones de acción - ocupan la mitad del espacio disponible */}
          <div className="flex gap-3 w-full sm:w-1/2">
            {" "}
            {/* Cambio clave aquí */}
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
              disabled={isLoading}
            >
              <SearchIcon className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            {hasFilters ? (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={isLoading}
                className="flex-1"
              >
                <FilterX className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            ) : (
              // Espacio reservado invisible
              <div className="flex-1" />
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-semibold hover:text-gray-900 transition-colors"
                    onClick={() => handleSort("nombre")}
                    disabled={isLoading}
                  >
                    Nombre {renderSortIcon("nombre")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-semibold hover:text-gray-900 transition-colors"
                    onClick={() => handleSort("cedula")}
                    disabled={isLoading}
                  >
                    Cédula {renderSortIcon("cedula")}
                  </button>
                </TableHead>
                <TableHead>RUC</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Mostrar skeleton loader durante la carga
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell colSpan={8}>
                      <div className="flex items-center space-x-4">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <UserPlus className="h-12 w-12 mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">
                        {hasFilters
                          ? "No se encontraron clientes activos con los filtros aplicados"
                          : "No hay clientes activos registrados"}
                      </p>
                      {hasFilters ? (
                        <Button variant="outline" onClick={handleClearFilters}>
                          Limpiar filtros
                        </Button>
                      ) : (
                        <Link to="/admin/clientes/new">
                          <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Agregar primer cliente
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.clienteId} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-gray-600">
                      #{client.clienteId.toString().padStart(3, "0")}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/admin/clientes/${client.clienteId}`}
                        className="font-medium text-gray-600 hover:text-blue-800 hover:underline"
                      >
                        {client.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                        {client.cedula}
                      </span>
                    </TableCell>
                    <TableCell>
                      {client.ruc ? (
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          {client.ruc}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin RUC</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">
                          {formatPhone(client.telefono)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.activo ? "default" : "secondary"}
                        className={`
                          ${
                            client.activo
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        `}
                      >
                        {client.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/clientes/${client.clienteId}/editar`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 hover:bg-blue-50"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            confirmInactivate(client.clienteId, client.nombre)
                          }
                          disabled={isInactivating === client.clienteId}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {isInactivating === client.clienteId
                            ? "Inactivando..."
                            : "Inactivar"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginación */}
      {!isLoading && pagination && pagination.totalPaginas > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <Paginacion
            totalPages={pagination.totalPaginas}
            currentPage={pagination.pagina}
            itemsPerPage={pagination.limite}
            totalItems={pagination.total}
          />
        </div>
      )}
    </div>
  );
};
