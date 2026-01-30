import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, CommentSchema } from '@/lib/schemas/comment.schema';
import { UseCommentFormProps, UseCommentFormReturn } from '@/types/forum.ui.types';

/**
 * Hook personalizado para gestionar el formulario de comentarios con validación.
 * 
 * Este hook integra React Hook Form con validación de Zod para manejar formularios
 * de comentarios. Proporciona validación en tiempo real, manejo de envío y cancelación,
 * y reseteo automático del formulario después de enviar.
 * 
 * Características:
 * - Validación en tiempo real con Zod
 * - Reseteo automático tras envío exitoso
 * - Manejo de errores de validación
 * - Soporte para cancelación con callback opcional
 * 
 * @hook
 * @param {UseCommentFormProps} props - Propiedades del hook
 * @param {Function} props.onSubmit - Callback ejecutado cuando el formulario es válido y se envía
 * @param {Function} [props.onCancel] - Callback opcional ejecutado cuando se cancela el formulario
 * @returns {UseCommentFormReturn} Objeto con métodos y estado del formulario
 * @returns {Function} returns.register - Función para registrar inputs del formulario
 * @returns {Object} returns.errors - Errores de validación del formulario
 * @returns {boolean} returns.isValid - Indica si el formulario es válido
 * @returns {Function} returns.handleFormSubmit - Handler del submit del formulario
 * @returns {Function} returns.handleCancel - Handler para cancelar y resetear el formulario
 * 
 * @example
 * // Uso en un componente de comentario
 * function CommentForm() {
 *   const { register, errors, isValid, handleFormSubmit, handleCancel } = useCommentForm({
 *     onSubmit: (content) => console.log('Enviar:', content),
 *     onCancel: () => console.log('Cancelado')
 *   });
 *   
 *   return (
 *     <form onSubmit={handleFormSubmit}>
 *       <textarea {...register('content')} />
 *       {errors.content && <span>{errors.content.message}</span>}
 *       <button type="submit" disabled={!isValid}>Publicar</button>
 *       <button type="button" onClick={handleCancel}>Cancelar</button>
 *     </form>
 *   );
 * }
 */
export const useCommentForm = ({ onSubmit, onCancel }: UseCommentFormProps): UseCommentFormReturn => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    mode: 'onChange',
    defaultValues: {
      content: ''
    }
  });

  /**
   * Maneja el envío del formulario después de validación exitosa.
   * 
   * Ejecuta el callback onSubmit con el contenido del comentario y resetea el formulario.
   * 
   * @param {CommentSchema} data - Datos validados del formulario
   */
  const onFormSubmit = (data: CommentSchema) => {
    onSubmit(data.content);
    reset();
  };

  /**
   * Maneja la cancelación del formulario.
   * 
   * Resetea el formulario y ejecuta el callback onCancel si fue proporcionado.
   */
  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return {
    register,
    errors,
    isValid,
    handleFormSubmit: handleSubmit(onFormSubmit),
    handleCancel
  };
};
