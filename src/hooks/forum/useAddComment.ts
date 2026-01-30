'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommentAction } from '@/actions/comments.actions';
import { useUIStore } from '@/stores/ui.store';
import { CommentDocument } from '@/types/firestore.types';

/**
 * Contexto para el rollback optimista de comentarios.
 * 
 * Almacena el estado anterior de los comentarios para poder revertir
 * los cambios en caso de error durante la creación de un comentario.
 * 
 * @interface AddCommentContext
 * @property {CommentDocument[] | undefined} previousComments - Lista de comentarios antes de la mutación
 */
interface AddCommentContext {
  previousComments: CommentDocument[] | undefined;
}

/**
 * Hook personalizado para agregar comentarios con actualización optimista.
 * 
 * Este hook utiliza React Query Mutation para manejar la creación de comentarios,
 * implementando actualizaciones optimistas en la UI (muestra el comentario inmediatamente)
 * antes de confirmar con el servidor. Incluye manejo de estados de carga y notificaciones.
 * 
 * Características:
 * - Actualización optimista: el comentario aparece inmediatamente en la UI
 * - Rollback automático en caso de error
 * - Notificaciones de éxito/error
 * - Loading state global
 * - Sincronización automática con el servidor
 * 
 * @hook
 * @param {string} postId - ID del post al que se agregará el comentario
 * @returns {UseMutationResult} Objeto de mutación de React Query con los siguientes métodos:
 * @returns {Function} returns.mutate - Función para ejecutar la mutación
 * @returns {Function} returns.mutateAsync - Versión async de mutate
 * @returns {boolean} returns.isPending - Indica si la mutación está en progreso
 * @returns {boolean} returns.isError - Indica si la mutación falló
 * @returns {boolean} returns.isSuccess - Indica si la mutación fue exitosa
 * @returns {Object|undefined} returns.data - Resultado de la mutación
 * @returns {Error|null} returns.error - Error si la mutación falló
 * 
 * @example
 * // Uso básico en un componente
 * function CommentForm({ postId }) {
 *   const { mutate, isPending } = useAddComment(postId);
 *   
 *   const handleSubmit = (content) => {
 *     mutate({ content });
 *   };
 *   
 *   return (
 *     <form onSubmit={() => handleSubmit('Mi comentario')}>
 *       <textarea />
 *       <button disabled={isPending}>Publicar</button>
 *     </form>
 *   );
 * }
 * 
 * @example
 * // Agregar una respuesta a un comentario existente
 * function ReplyForm({ postId, parentCommentId }) {
 *   const { mutate } = useAddComment(postId);
 *   
 *   const handleReply = (content) => {
 *     mutate({ content, parentId: parentCommentId });
 *   };
 *   
 *   return <button onClick={() => handleReply('Respuesta')}>Responder</button>;
 * }
 */
export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { setGlobalLoading, showNotification } = useUIStore();

  return useMutation<
    { success: boolean; error?: string }, 
    Error,
    { content: string; parentId?: string | null }, 
    AddCommentContext 
  >({
    onMutate: async ({ content, parentId }) => {
      setGlobalLoading(true);

      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const previousComments = queryClient.getQueryData<CommentDocument[]>(['comments', postId]);

      const optimisticComment: CommentDocument = {
        id: `temp-${Date.now()}`,
        postId,
        parentId: parentId || null,
        content,
        author: {
          uid: 'me', 
          displayName: 'Yo', 
        },
        authorId: 'me',
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, // Timestamp fake
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        likeCount: 0,
        likedBy: [],
        replyCount: 0,
        isDeleted: false,
        isOptimistic: true
      };

      queryClient.setQueryData<CommentDocument[]>(['comments', postId], (old = []) => {
        return [optimisticComment, ...old];
      });

      return { previousComments };
    },

    mutationFn: async ({ content, parentId }) => {
      return await createCommentAction(postId, content, parentId);
    },

    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
      showNotification('error', 'No se pudo publicar el comentario.');
    },

    onSuccess: (data, variables, context) => {
      if (!data.success) {
        if (context?.previousComments) {
          queryClient.setQueryData(['comments', postId], context.previousComments);
        }
        showNotification('error', data.error || 'Error desconocido');
      } else {
        showNotification('success', 'Comentario publicado');
      }
    },

    onSettled: () => {
      setGlobalLoading(false);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};
