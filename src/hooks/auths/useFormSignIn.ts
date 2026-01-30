import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInFormData } from '@/lib/schemas/sign-in.schema';
import { loginAction } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';

/**
 * Hook personalizado para gestionar el formulario de inicio de sesión.
 * 
 * Este hook integra React Hook Form con validación de Zod para manejar el formulario
 * de inicio de sesión. Configura valores por defecto, validación de esquema, y proporciona
 * un handler de submit que maneja la autenticación del usuario, incluyendo navegación
 * exitosa y gestión de errores.
 * 
 * @hook
 * @returns {Object} Objeto con todas las propiedades y métodos de React Hook Form más onSubmit
 * @returns {Function} returns.onSubmit - Handler del formulario que ejecuta la autenticación
 * @returns {Object} returns.formState - Estado actual del formulario (errors, isSubmitting, etc.)
 * @returns {Function} returns.register - Función para registrar inputs del formulario
 * @returns {Function} returns.setError - Función para establecer errores manualmente
 * 
 * @example
 * // Uso en un componente de inicio de sesión
 * function SignInForm() {
 *   const { register, formState: { errors }, onSubmit } = useFormSignIn();
 *   
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <input {...register('email')} />
 *       <input {...register('password')} type="password" />
 *       <button type="submit">Iniciar Sesión</button>
 *     </form>
 *   );
 * }
 */
export function useFormSignIn() {
  const router = useRouter();
  
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
    mode: 'onBlur',
  });

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * 
   * Procesa los datos del formulario, llama a la acción de login, y maneja el resultado:
   * - Si es exitoso: redirige al usuario a la página del foro
   * - Si falla: establece el error apropiado en el formulario
   * 
   * @async
   * @param {SignInFormData} data - Datos del formulario (email, password, remember)
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await loginAction(data);
      
      if (result.success) {
        router.push('/foro');
      } else {
        if ('message' in result) {
            form.setError('root', {
                message: result.message,
            });
        } 
        else if ('errors' in result) {
             form.setError('root', {
                message: 'Verifica los campos del formulario.',
             });
        } else {
            form.setError('root', {
                message: 'Autenticacion fallida. Por favor, intenta de nuevo.',
            });
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      form.setError('root', {
        message: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}