import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Cliente,
  ClienteCreateUpdateDto,
} from "@/interfaces/cliente.interface";
import {
  X,
  SaveAll,
  MapPin,
  Calendar,
  Phone,
  User,
  Hash,
  Building,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  cliente: Cliente;
  mode: "create" | "edit";
  isPending: boolean;
  onSubmit: (clienteLike: ClienteCreateUpdateDto) => Promise<void>;
  onCancel: () => void;
  serverError?: string;
}

interface FormInputs extends Cliente {}

export const ClienteForm = ({
  cliente,
  mode,
  onSubmit,
  onCancel,
  isPending,
  serverError,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormInputs>({
    defaultValues: cliente,
  });

  const isCreateMode = mode === "create";

  useEffect(() => {
    reset(cliente);
  }, [cliente, reset]);

  const title = isCreateMode ? "Nuevo Cliente" : "Editar Cliente";
  const subtitle = isCreateMode
    ? "Complete la información para registrar un nuevo cliente"
    : "Modifique la información del cliente según sea necesario";

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("telefono", value, { shouldValidate: true });
  };

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("cedula", value, { shouldValidate: true });
  };

  const currentPhone = watch("telefono");
  const currentCedula = watch("cedula");

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const handleFormSubmit = async (data: FormInputs) => {
    const clienteData: ClienteCreateUpdateDto = {
      ...data
    };

    await onSubmit(clienteData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <AdminTitle title={title} subtitle={subtitle} />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
            disabled={isPending}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <SaveAll className="w-4 h-4 mr-2" />
            {isCreateMode ? "Crear Cliente" : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Error del servidor</h3>
          </div>
          <p className="mt-1 text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-8">
        {/* Fila 1: Nombre, Teléfono, Fecha Nacimiento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Label
              htmlFor="nombre"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700"
            >
              <User className="h-4 w-4" />
              Nombre completo *
            </Label>
            <Input
              id="nombre"
              type="text"
              {...register("nombre", {
                required: "El nombre es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
              })}
              className={cn("w-full", {
                "border-red-500": errors.nombre,
              })}
              placeholder="Juan Pérez"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="telefono"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700"
            >
              <Phone className="h-4 w-4" />
              Teléfono *
            </Label>
            <Input
              id="telefono"
              type="tel"
              value={currentPhone ? formatPhoneDisplay(currentPhone) : ""}
              onChange={handlePhoneChange}
              className={cn("w-full", {
                "border-red-500": errors.telefono,
              })}
              placeholder="0987654321"
              maxLength={12}
            />
            <input
              type="hidden"
              {...register("telefono", {
                required: "El teléfono es requerido",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El teléfono debe tener 10 dígitos",
                },
              })}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="fechaNacimiento"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700"
            >
              <Calendar className="h-4 w-4" />
              Fecha de nacimiento
            </Label>
            <Input
              id="fechaNacimiento"
              type="date"
              {...register("fechaNacimiento")}
              max={new Date().toISOString().split("T")[0]}
              className="w-full"
            />
          </div>
        </div>

        {/* Fila 2: Dirección (3 columnas pero la dirección ocupa 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Label
              htmlFor="direccion"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700"
            >
              <MapPin className="h-4 w-4" />
              Dirección *
            </Label>
            <Textarea
              id="direccion"
              {...register("direccion", {
                required: "La dirección es requerida",
                minLength: {
                  value: 10,
                  message: "La dirección debe tener al menos 10 caracteres",
                },
              })}
              rows={3}
              className={cn("w-full", {
                "border-red-500": errors.direccion,
              })}
              placeholder="Calle Principal 123, Barrio, Ciudad"
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">
                {errors.direccion.message}
              </p>
            )}
          </div>

          {/* Espacio vacío para mantener 3 columnas */}
          <div></div>
        </div>

        {/* Fila 3: Cédula, RUC, Estado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Label
              htmlFor="cedula"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700"
            >
              <Hash className="h-4 w-4" />
              Número de cédula *
            </Label>
            <Input
              id="cedula"
              type="text"
              value={currentCedula || ""}
              onChange={handleCedulaChange}
              className={cn("w-full", {
                "border-red-500": errors.cedula,
              })}
              placeholder="1234567"
              maxLength={10}
            />
            <input
              type="hidden"
              {...register("cedula", {
                required: "La cédula es requerida",
                pattern: {
                  value: /^[0-9]{6,10}$/,
                  message: "La cédula debe tener mínimo 6 dígitos",
                },
              })}
            />
            {errors.cedula && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cedula.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="ruc"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700"
            >
              <Building className="h-4 w-4" />
              Número de RUC
            </Label>
            <Input
              id="ruc"
              type="text"
              {...register("ruc")}
              className="w-full"
              placeholder="80009735-1, 4341713-2, 526839-9"
              maxLength={30}
            />
          </div>

          {/* Modificación: Solo mostrar estado en modo edición */}
          {!isCreateMode && (
            <div>
              <Label className="block mb-2 text-sm font-medium text-slate-700">
                Estado del cliente
              </Label>
              <div className="flex items-center justify-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
                {watch("activo") ? (
                  <span className="flex items-center gap-2 text-green-700">
                    <UserCheck className="h-4 w-4" />
                    Activo
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-gray-700">
                    <UserX className="h-4 w-4" />
                    Inactivo
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Espacio vacío para mantener 3 columnas en modo create */}
          {isCreateMode && <div></div>}
        </div>

        {/* Fila 4: GPS - 3 columnas con GPS ocupando 2 */}

        {/* Fila 5: ID Cliente (solo en modo edición) y espacios vacíos para 3 columnas */}
        {!isCreateMode && cliente.clienteId > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Label className="block mb-2 text-sm font-medium text-slate-700">
                ID del Cliente
              </Label>
              <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50 font-mono">
                #{cliente.clienteId.toString().padStart(3, "0")}
              </div>
            </div>

            {/* Espacios vacíos para mantener 3 columnas */}
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    </form>
  );
};
