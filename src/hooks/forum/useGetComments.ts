'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPostCommentsAction } from '@/actions/comments.actions';
import { CommentDocument } from '@/types/firestore.types';
import { Timestamp } from 'firebase/firestore';
import { SerializedCommentDocument } from '@/types/comments.types';

/**
 * Hook personalizado para obtener comentarios de un post con React Query.
 * 
 * Este hook obtiene todos los comentarios de un post específico desde Firestore,
 * utilizando React Query para caché y sincronización automática. Transforma los
 * datos serializados del servidor (con timestamps como objetos planos) de vuelta
 * a objetos Timestamp de Firestore para uso en el cliente.
 * 
 * Características:
 * - Caché de 1 minuto (staleTime) para optimizar rendimiento
 * - Deserialización automática de timestamps de Firestore
 * - Sin refetch al enfocar ventana (refetchOnWindowFocus: false)
 * - Sin reintentos automáticos en caso de error (retry: false)
 * - Manejo de errores con mensajes descriptivos
 * 
 * @hook
 * @param {string} postId - ID del post del cual obtener los comentarios
 * @returns {UseQueryResult<CommentDocument[], Error>} Objeto de query de React Query
 * @returns {CommentDocument[]|undefined} returns.data - Array de comentarios con timestamps deserializados
 * @returns {boolean} returns.isLoading - Indica si la consulta inicial está cargando
 * @returns {boolean} returns.isFetching - Indica si hay un refetch en progreso
 * @returns {boolean} returns.isError - Indica si ocurrió un error
 * @returns {Error|null} returns.error - Error si la consulta falló
 * @returns {boolean} returns.isSuccess - Indica si la consulta fue exitosa
 * @returns {Function} returns.refetch - Función para refrescar manualmente los datos
 * 
 * @example
 * // Uso básico en un componente de comentarios
 * function CommentList({ postId }) {
 *   const { data: comments, isLoading, isError } = useGetComments(postId);
 *   
 *   if (isLoading) return <div>Cargando comentarios...</div>;
 *   if (isError) return <div>Error al cargar comentarios</div>;
 *   
 *   return (
 *     <div>
 *       {comments?.map(comment => (
 *         <Comment key={comment.id} comment={comment} />
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Refetch manual de comentarios
 * function CommentSection({ postId }) {
 *   const { data: comments, refetch } = useGetComments(postId);
 *   
 *   return (
 *     <div>
 *       <button onClick={() => refetch()}>Actualizar comentarios</button>
 *       {comments?.map(comment => <Comment key={comment.id} {...comment} />)}
 *     </div>
 *   );
 * }
 */
export const useGetComments = (postId: string): UseQueryResult<CommentDocument[], Error> => {
  const query = useQuery<CommentDocument[], Error>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const result = await getPostCommentsAction(postId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch comments');
      }
      
      const serializedData = result.data || [];
      
      return serializedData.map((doc: SerializedCommentDocument) => ({
        ...doc,
        createdAt: doc.createdAt 
          ? new Timestamp(doc.createdAt.seconds, doc.createdAt.nanoseconds)
          : Timestamp.now(), 
        updatedAt: doc.updatedAt 
          ? new Timestamp(doc.updatedAt.seconds, doc.updatedAt.nanoseconds)
          : undefined
      })) as CommentDocument[];
    },
    staleTime: 1000 * 60, 
    refetchOnWindowFocus: false,
    retry: false, 
  });

  return query;
};