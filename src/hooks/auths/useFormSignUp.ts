import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/sign-up.schema';
import { registerAction } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';

/**
 * Hook personalizado para gestionar el formulario de registro de usuarios.
 * 
 * Este hook integra React Hook Form con validación de Zod para manejar el formulario
 * de registro. Configura valores por defecto, validación de esquema, y proporciona
 * un handler de submit que maneja el registro del usuario, incluyendo navegación
 * exitosa y gestión de errores.
 * 
 * @hook
 * @returns {Object} Objeto con todas las propiedades y métodos de React Hook Form más onSubmit
 * @returns {Function} returns.onSubmit - Handler del formulario que ejecuta el registro
 * @returns {Object} returns.formState - Estado actual del formulario (errors, isSubmitting, etc.)
 * @returns {Function} returns.register - Función para registrar inputs del formulario
 * @returns {Function} returns.setError - Función para establecer errores manualmente
 * 
 * @example
 * // Uso en un componente de registro
 * function SignUpForm() {
 *   const { register, formState: { errors }, onSubmit } = useFormSignUp();
 *   
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <input {...register('fullname')} />
 *       <input {...register('email')} />
 *       <input {...register('password')} type="password" />
 *       <input {...register('terms')} type="checkbox" />
 *       <button type="submit">Registrarse</button>
 *     </form>
 *   );
 * }
 */
export function useFormSignUp() {
  const router = useRouter();
  
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      terms: false,
    },
    mode: 'onBlur',
  });

  /**
   * Maneja el envío del formulario de registro de usuario.
   * 
   * Procesa los datos del formulario, llama a la acción de registro, y maneja el resultado:
   * - Si es exitoso: redirige al usuario a la página del foro
   * - Si falla: establece el error apropiado en el formulario según el tipo de error
   * 
   * @async
   * @param {SignUpFormData} data - Datos del formulario (fullname, email, password, terms)
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await registerAction(data);
      
      if (result.success) {
        router.push('/foro');
      } else {
         if ('message' in result) {
            form.setError('root', {
                message: result.message,
            });
        } else if ('errors' in result) {
             form.setError('root', {
                message: 'Porfavor verifica los campos del formulario.',
             });
        } else {
             form.setError('root', {
                message: 'Registro fallido. Por favor, intenta de nuevo.',
            });
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      form.setError('root', {
        message: 'Ocurrió un error inesperado durante el registro. Por favor, intenta de nuevo.',
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}