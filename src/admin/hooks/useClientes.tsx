import type { ClientesRequest } from '@/interfaces/clientes.request';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { listaClientesAction } from '../actions/clientes/lista-clientes.action';



export const useClientes = () => {
  const [searchParams] = useSearchParams();

  // Parámetros de paginación
  const pagina = Number(searchParams.get('page')) || 1;
  const limite = Number(searchParams.get('limit')) || 5;

  // Parámetros de filtros
  const search = searchParams.get('search') || undefined;
  const activo = searchParams.get('activo') || undefined;
  
  // Parámetros de ordenamiento
  const campo = searchParams.get('sortField') || 'nombre';
  const direccion = (searchParams.get('sortDir') as 'asc' | 'desc') || 'asc';

  // Construir el request body
  const requestData: ClientesRequest = {
    paginacion: {
      pagina,
      limite,
    },
    ordenamiento: {
      campo,
      direccion,
    },
  };

  // Agregar filtros solo si existen
  if (search || activo) {
    requestData.filtros = {
      ...(search && { search }),
      ...(activo && { activo: activo === 'true' }),
    };
  }

  return useQuery({
    queryKey: ['clients', pagina, limite, search, activo, campo, direccion],
    queryFn: () => listaClientesAction(requestData),
    staleTime: 500,
  });
};