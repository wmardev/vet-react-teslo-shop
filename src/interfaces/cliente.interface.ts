// interfaces/cliente.interface.ts
export interface Cliente {
  clienteId: number;
  nombre: string;
  cedula: string;
  ruc: string;
  telefono: string;
  direccion: string;
  fechaNacimiento?: string;
  ubicacionGps?: string;
  activo?: boolean;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaMod?: string;
  usuarioMod?: string;

}

// Tipo para crear/actualizar (sin los campos auto-generados)
export interface ClienteCreateUpdateDto {
  nombre: string;
  cedula: string;
  ruc?: string;
  telefono: string;
  direccion: string;
  fechaNacimiento?: string;
  ubicacionGps?: string;
}

// Tipo para respuesta (incluye todos los campos)
export interface ClienteResponse extends Cliente {
  // Ya incluye todos los campos de Cliente
}
