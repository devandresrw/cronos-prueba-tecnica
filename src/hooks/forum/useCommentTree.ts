import { useMemo } from 'react';
import { CommentDocument } from '@/types/firestore.types';
import { CommentUIModel } from '@/types/forum.ui.types';
import { formatTime } from '@/lib/utils/format-time';

/**
 * Hook personalizado para transformar una lista plana de comentarios en una estructura de árbol jerárquica.
 * 
 * Este hook procesa comentarios de Firestore y los organiza en una estructura de árbol donde:
 * - Los comentarios principales (sin parentId) se convierten en nodos raíz
 * - Las respuestas se anidan dentro de sus comentarios padre
 * - Los datos se transforman del formato de Firestore al formato de UI (CommentUIModel)
 * 
 * El resultado está memoizado para optimizar el rendimiento y evitar recálculos innecesarios.
 * 
 * Algoritmo:
 * 1. Crea un Map de todos los comentarios transformados a CommentUIModel
 * 2. Itera nuevamente para construir las relaciones padre-hijo
 * 3. Los comentarios con parentId se añaden al array 'replies' de su padre
 * 4. Los comentarios sin padre (o con padre no encontrado) se añaden a la raíz
 * 
 * @hook
 * @param {CommentDocument[] | undefined} comments - Lista plana de comentarios desde Firestore
 * @returns {CommentUIModel[]} Array de comentarios raíz con sus respuestas anidadas
 * 
 * @example
 * // Uso en un componente de foro
 * function CommentList({ postId }) {
 *   const { data: comments } = useGetComments(postId);
 *   const commentTree = useCommentTree(comments);
 *   
 *   return (
 *     <div>
 *       {commentTree.map(comment => (
 *         <Comment key={comment.id} comment={comment}>
 *           {comment.replies.map(reply => (
 *             <Reply key={reply.id} comment={reply} />
 *           ))}
 *         </Comment>
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Comentarios vacíos o indefinidos
 * const tree = useCommentTree(undefined);
 * // Retorna: []
 */
export const useCommentTree = (comments: CommentDocument[] | undefined) => {
  return useMemo(() => {
    if (!comments) return [];

    const commentMap = new Map<string, CommentUIModel>();
    const roots: CommentUIModel[] = [];

    comments.forEach((c) => {
      commentMap.set(c.id, {
        id: c.id,
        authorId: c.authorId || c.author.uid, 
        user: {
          name: c.author.displayName,
          avatar: '', 
        },
        time: formatTime(c.createdAt),
        message: c.content,
        likes: c.likeCount,
        parentId: c.parentId,
        isOptimistic: c.isOptimistic,
        replies: [],
      });
    });

    comments.forEach((c) => {
      const uiComment = commentMap.get(c.id);
      if (!uiComment) return;

      if (c.parentId) {
        const parent = commentMap.get(c.parentId);
        if (parent) {
          parent.replies.push(uiComment);
        } else {
          roots.push(uiComment);
        }
      } else {
        roots.push(uiComment);
      }
    });

    return roots;
  }, [comments]);
};
