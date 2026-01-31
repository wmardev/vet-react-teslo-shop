import type { Cliente } from "@/interfaces/cliente.interface";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Navigation,
  Hash,
  Building,
  UserCheck,
  UserX,
} from "lucide-react";

interface Props {
  cliente: Cliente;
}

export const ClienteView = ({ cliente }: Props) => {
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Usar UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${day}/${month}/${year}`;
  };

  const parseGPS = (gps: string) => {
    if (!gps) return { lat: "", lng: "" };
    const match = gps.match(/\(([^,]+),\s*([^)]+)\)/);
    if (match) {
      return { lat: match[1].trim(), lng: match[2].trim() };
    }
    return { lat: "", lng: "" };
  };

  const gpsCoords = parseGPS(cliente.ubicacionGps || "");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Información del Cliente
          </h1>
          <p className="text-slate-600 mt-2">
            Visualización de todos los datos del cliente registrados en el
            sistema
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-8">
        {/* Fila 1: Nombre, Teléfono, Fecha Nacimiento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
              <User className="h-4 w-4" />
              Nombre completo *
            </label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
              {cliente.nombre}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
              <Phone className="h-4 w-4" />
              Teléfono *
            </label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
              {formatPhone(cliente.telefono)}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
              <Calendar className="h-4 w-4" />
              Fecha de nacimiento
            </label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
              {cliente.fechaNacimiento
                ? formatDate(cliente.fechaNacimiento)
                : ""}
            </div>
          </div>
        </div>

        {/* Fila 2: Dirección (3 columnas pero la dirección ocupa 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
              <MapPin className="h-4 w-4" />
              Dirección *
            </label>
            <div className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none border-slate-200 bg-slate-50">
              {cliente.direccion}
            </div>
          </div>

          {/* Espacio vacío para mantener 3 columnas */}
          <div></div>
        </div>

        {/* Fila 3: Cédula, RUC, Estado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
              <Hash className="h-4 w-4" />
              Número de cédula *
            </label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
              {cliente.cedula}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
              <Building className="h-4 w-4" />
              Número de RUC
            </label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
              {cliente.ruc || ""}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Estado del cliente *
            </label>
            <div className="flex items-center justify-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
              {cliente.activo ? (
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
        </div>

        {/* Fila 4: GPS (si existe) - 3 columnas con GPS ocupando 2 */}
        {(gpsCoords.lat || gpsCoords.lng) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                <Navigation className="h-4 w-4" />
                Coordenadas GPS
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">
                    Latitud
                  </label>
                  <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
                    {gpsCoords.lat || ""}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">
                    Longitud
                  </label>
                  <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 bg-slate-50">
                    {gpsCoords.lng || ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Espacio vacío para mantener 3 columnas */}
            <div></div>
          </div>
        )}

        {/* Fila 5: ID Cliente y espacios vacíos para 3 columnas */}
        {cliente.clienteId > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                ID del Cliente
              </label>
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
    </div>
  );
};
