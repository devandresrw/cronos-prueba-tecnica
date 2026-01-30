'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommentAction } from '@/actions/comments.actions';
import { useUIStore } from '@/stores/ui.store';
import { CommentDocument } from '@/types/firestore.types';

/**
 * Hook personalizado para eliminar comentarios con actualización optimista.
 * 
 * Este hook utiliza React Query Mutation para manejar la eliminación de comentarios,
 * implementando actualización optimista en la UI (remueve el comentario inmediatamente)
 * antes de confirmar con el servidor. Incluye rollback automático en caso de error
 * y notificaciones de estado.
 * 
 * Características:
 * - Actualización optimista: el comentario desaparece inmediatamente de la UI
 * - Rollback automático si la eliminación falla en el servidor
 * - Notificaciones de éxito/error
 * - Sincronización automática con el servidor después de completar
 * - Cancelación de queries pendientes para evitar condiciones de carrera
 * 
 * @hook
 * @param {string} postId - ID del post que contiene el comentario a eliminar
 * @returns {UseMutationResult} Objeto de mutación de React Query con los siguientes métodos:
 * @returns {Function} returns.mutate - Función para ejecutar la eliminación pasando el commentId
 * @returns {Function} returns.mutateAsync - Versión async de mutate
 * @returns {boolean} returns.isPending - Indica si la eliminación está en progreso
 * @returns {boolean} returns.isError - Indica si la eliminación falló
 * @returns {boolean} returns.isSuccess - Indica si la eliminación fue exitosa
 * @returns {Object|undefined} returns.data - Resultado de la eliminación
 * @returns {Error|null} returns.error - Error si la eliminación falló
 * 
 * @example
 * // Uso básico en un componente de comentario
 * function CommentActions({ postId, commentId }) {
 *   const { mutate, isPending } = useDeleteComment(postId);
 *   
 *   const handleDelete = () => {
 *     if (confirm('¿Seguro que deseas eliminar este comentario?')) {
 *       mutate(commentId);
 *     }
 *   };
 *   
 *   return (
 *     <button onClick={handleDelete} disabled={isPending}>
 *       {isPending ? 'Eliminando...' : 'Eliminar'}
 *     </button>
 *   );
 * }
 * 
 * @example
 * // Uso con async/await para manejar el resultado
 * function DeleteButton({ postId, commentId }) {
 *   const { mutateAsync } = useDeleteComment(postId);
 *   
 *   const handleDelete = async () => {
 *     try {
 *       await mutateAsync(commentId);
 *       console.log('Comentario eliminado exitosamente');
 *     } catch (error) {
 *       console.error('Error al eliminar:', error);
 *     }
 *   };
 *   
 *   return <button onClick={handleDelete}>Eliminar</button>;
 * }
 */
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation<
    { success: boolean; error?: string },
    Error,
    string,
    { previousComments: CommentDocument[] | undefined }
  >({
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const previousComments = queryClient.getQueryData<CommentDocument[]>(['comments', postId]);

      queryClient.setQueryData<CommentDocument[]>(['comments', postId], (old = []) => {
        return old.filter((comment) => comment.id !== commentId);
      });

      return { previousComments };
    },

    mutationFn: async (commentId: string) => {
      return await deleteCommentAction(postId, commentId);
    },

    onError: (err, commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
      showNotification('error', 'No se pudo eliminar el comentario');
    },

    onSuccess: (data, commentId, context) => {
      if (!data.success) {
        if (context?.previousComments) {
          queryClient.setQueryData(['comments', postId], context.previousComments);
        }
        showNotification('error', data.error || 'Error al eliminar');
      } else {
        showNotification('success', 'Comentario eliminado');
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};
