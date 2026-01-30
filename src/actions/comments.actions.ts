'use server';

import { auth } from '@/auth';
import { CommentsService } from '@/lib/services/comments.service';
import { commentSchema } from '@/lib/schemas/comment.schema';
import { CommentDocument } from '@/types/firestore.types';
import {
  GetPostCommentsResponse,
  CreateCommentResponse,
  ToggleLikeResponse,
  DeleteCommentResponse,
  SerializedCommentDocument,
  SerializedTimestamp
} from '@/types/comments.types';
import { revalidatePath } from 'next/cache';

/**
 * Convierte un CommentDocument de Firestore en un formato serializable para Next.js.
 * Transforma los objetos Timestamp de Firestore en objetos planos con seconds y nanoseconds.
 * Esto es necesario porque los Timestamps de Firestore no son serializables en componentes de cliente.
 * 
 * @param {CommentDocument} comment - Documento de comentario desde Firestore
 * @returns {SerializedCommentDocument} Comentario con timestamps serializados
 * 
 * @example
 * const firestoreComment = await getCommentFromFirestore();
 * const serialized = serializeComment(firestoreComment);
 * // Ahora puede ser enviado al cliente sin errores de serialización
 * 
 * @remarks
 * Esta función es crucial para la interoperabilidad entre Server Components y Client Components
 */
function serializeComment(comment: CommentDocument): SerializedCommentDocument {
  return {
    ...comment,
    createdAt: comment.createdAt ? { 
      seconds: comment.createdAt.seconds, 
      nanoseconds: comment.createdAt.nanoseconds 
    } : null,
    updatedAt: comment.updatedAt ? { 
      seconds: comment.updatedAt.seconds, 
      nanoseconds: comment.updatedAt.nanoseconds 
    } : null,
  };
}

/**
 * Acción de servidor para obtener todos los comentarios de un post específico.
 * Recupera los comentarios desde Firestore y los serializa para su uso en el cliente.
 * 
 * @param {string} postId - ID único del post del cual obtener los comentarios
 * 
 * @returns {Promise<GetPostCommentsResponse>} Objeto con el resultado:
 * - Si success es true: incluye 'data' con el array de comentarios serializados
 * - Si success es false: incluye 'error' con mensaje descriptivo del problema
 * 
 * @example
 * const result = await getPostCommentsAction('post-123');
 * if (result.success) {
 *   console.log(`Se encontraron ${result.data.length} comentarios`);
 *   result.data.forEach(comment => {
 *     console.log(comment.content);
 *   });
 * } else {
 *   console.error(result.error);
 * }
 * 
 * @remarks
 * - Los comentarios incluyen información del autor, likes, respuestas anidadas, etc.
 * - Los timestamps son serializados para compatibilidad con componentes de cliente
 * - No requiere autenticación para obtener comentarios
 */
export async function getPostCommentsAction(postId: string): Promise<GetPostCommentsResponse> {
  try {
    const comments = await CommentsService.getCommentsByPostId(postId);
    return { success: true, data: comments.map(serializeComment) };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, error: 'No se pudieron cargar los comentarios' };
  }
}

/**
 * Acción de servidor para crear un nuevo comentario en un post.
 * Permite crear comentarios principales o respuestas a comentarios existentes (anidados).
 * Requiere que el usuario esté autenticado para poder comentar.
 * 
 * @param {string} postId - ID único del post donde se creará el comentario
 * @param {string} content - Contenido del comentario (texto)
 * @param {string | null} [parentId=null] - ID del comentario padre si es una respuesta, null para comentarios principales
 * 
 * @returns {Promise<CreateCommentResponse>} Objeto con el resultado:
 * - Si success es true: comentario creado exitosamente
 * - Si success es false: incluye 'error' con el motivo del fallo
 * 
 * @example
 * // Crear un comentario principal
 * const result1 = await createCommentAction('post-123', 'Este es mi comentario');
 * 
 * // Crear una respuesta a otro comentario
 * const result2 = await createCommentAction('post-123', 'Respondo al comentario', 'comment-456');
 * 
 * if (result1.success) {
 *   console.log('Comentario publicado');
 * } else {
 *   console.error(result1.error); // 'Debes iniciar sesión para comentar'
 * }
 * 
 * @remarks
 * - Revalida el path '/foro' después de crear el comentario para actualizar la UI
 * - El autor se obtiene automáticamente de la sesión actual
 * - Si parentId es proporcionado, el comentario será una respuesta anidada
 */
export async function createCommentAction(
  postId: string, 
  content: string, 
  parentId: string | null = null
): Promise<CreateCommentResponse> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Debes iniciar sesión para comentar' };
  }

  const validation = commentSchema.safeParse({ content });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  try {
    const author = {
      uid: session.user.id,
      displayName: session.user.name || 'Usuario',
    };

    await CommentsService.createComment(postId, content, author, parentId);
    
    revalidatePath(`/foro`); 
    return { success: true };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error: 'Error al publicar el comentario' };
  }
}

/**
 * Acción de servidor para dar o quitar like a un comentario.
 * Funciona como toggle: si el usuario ya dio like lo quita, si no lo había dado lo agrega.
 * Requiere autenticación para poder dar likes.
 * 
 * @param {string} postId - ID único del post que contiene el comentario
 * @param {string} commentId - ID único del comentario al que se le dará/quitará like
 * 
 * @returns {Promise<ToggleLikeResponse>} Objeto con el resultado:
 * - Si success es true: like actualizado correctamente
 * - Si success es false: incluye 'error' con mensaje descriptivo
 * 
 * @example
 * const result = await toggleLikeAction('post-123', 'comment-456');
 * if (result.success) {
 *   console.log('Like actualizado');
 * } else {
 *   console.error(result.error); // 'Inicia sesión para dar like'
 * }
 * 
 * @remarks
 * - Si el usuario ya dio like, esta acción lo elimina (unlike)
 * - Si el usuario no había dado like, esta acción lo agrega
 * - Revalida el path '/foro' para reflejar los cambios en la UI inmediatamente
 * - El ID del usuario se obtiene automáticamente de la sesión
 */
export async function toggleLikeAction(postId: string, commentId: string): Promise<ToggleLikeResponse> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Inicia sesión para dar like' };
  }

  try {
    await CommentsService.toggleLike(postId, commentId, session.user.id);
    revalidatePath(`/foro`);
    return { success: true };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Error al actualizar like' };
  }
}

/**
 * Acción de servidor para eliminar un comentario (soft delete).
 * No elimina físicamente el comentario, sino que lo marca como eliminado.
 * Solo el autor del comentario puede eliminarlo.
 * 
 * @param {string} postId - ID único del post que contiene el comentario
 * @param {string} commentId - ID único del comentario a eliminar
 * 
 * @returns {Promise<DeleteCommentResponse>} Objeto con el resultado:
 * - Si success es true: comentario eliminado correctamente
 * - Si success es false: incluye 'error' con mensaje descriptivo del problema
 * 
 * @example
 * const result = await deleteCommentAction('post-123', 'comment-456');
 * if (result.success) {
 *   console.log('Comentario eliminado');
 * } else {
 *   console.error(result.error); // 'No autorizado' o 'No se pudo eliminar el comentario'
 * }
 * 
 * @remarks
 * - Implementa soft delete: el comentario permanece en la base de datos pero marcado como eliminado
 * - Solo el autor del comentario puede eliminarlo (verificado en CommentsService)
 * - Revalida el path '/foro' para actualizar la UI inmediatamente
 * - El ID del usuario se obtiene de la sesión para verificar autorización
 * - Los comentarios eliminados pueden mostrar un mensaje como '[Comentario eliminado]' en la UI
 */
export async function deleteCommentAction(postId: string, commentId: string): Promise<DeleteCommentResponse> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    await CommentsService.softDeleteComment(postId, commentId, session.user.id);
    revalidatePath(`/foro`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: 'No se pudo eliminar el comentario' };
  }
}