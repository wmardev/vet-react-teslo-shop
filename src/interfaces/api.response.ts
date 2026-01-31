export interface ApiResponse<T = any> {
  ok: boolean;
  mensaje: string;
  resultado?: T;
}