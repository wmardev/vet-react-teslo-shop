import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ClienteForm } from './ui/ClienteForm';
import type { ClienteCreateUpdateDto } from '@/interfaces/cliente.interface';
import { useCrudCliente } from '@/admin/hooks/useCrudCliente';


export const ClienteCreatePage = () => {
  const navigate = useNavigate();
  
  // Usamos el hook con id='new' para obtener la mutación
  const { mutation } = useCrudCliente('new');

  const handleSubmit = async (clienteLike: ClienteCreateUpdateDto) => {
    try {
      const dataToSubmit = {
        ...clienteLike
      };

      await mutation.mutateAsync(dataToSubmit, {
        onSuccess: (response) => {
          if (response.ok && response.resultado) {
            toast.success(response.mensaje, {
              position: 'top-right',
              duration: 3000
            });
            // Redirigir a la vista del nuevo cliente
            navigate(`/admin/clientes/${response.resultado.clienteId}`);
          } else {
            toast.error(response.mensaje || 'Error al crear el cliente', {
              position: 'top-right',
              duration: 5000
            });
          }
        },
        onError: (error) => {
          toast.error(error.message || 'Error al procesar la solicitud', {
            position: 'top-right',
            duration: 5000
          });
        }
      });
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la solicitud', {
        position: 'top-right',
        duration: 5000
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/clientes');
  };

  return (
    <ClienteForm
      cliente={{
        clienteId: 0,
        nombre: '',
        cedula: '',
        ruc: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: '',
        ubicacionGps: ''
      }}
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={mutation.isPending}
    />
  );
};