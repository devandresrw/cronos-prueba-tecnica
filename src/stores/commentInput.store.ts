import { create } from 'zustand';

/**
 * Estado para gestionar el input de comentarios y respuestas.
 * 
 * Define la estructura del estado que controla a qué comentario se está respondiendo
 * actualmente en la interfaz del foro.
 * 
 * @interface CommentInputState
 * @property {string | null} replyingTo - ID del comentario al que se está respondiendo, o null si no hay respuesta activa
 * @property {Function} setReplyingTo - Establece el comentario al que se está respondiendo
 * @property {Function} clearReplyingTo - Limpia el estado de respuesta activa
 */
interface CommentInputState {
  replyingTo: string | null;
  setReplyingTo: (commentId: string | null) => void;
  clearReplyingTo: () => void;
}

/**
 * Store de Zustand para gestionar el estado de respuestas a comentarios.
 * 
 * Este store mantiene el estado global de qué comentario está siendo respondido
 * actualmente en la interfaz del foro. Permite activar y desactivar el modo de
 * respuesta, mostrando u ocultando el formulario de respuesta según corresponda.
 * 
 * @constant
 * @type {Function}
 * @returns {CommentInputState} Objeto con el estado y acciones del store
 * @returns {string|null} returns.replyingTo - ID del comentario siendo respondido, o null
 * @returns {Function} returns.setReplyingTo - Activa el modo de respuesta para un comentario específico
 * @returns {Function} returns.clearReplyingTo - Desactiva el modo de respuesta
 * 
 * @example
 * // Activar modo de respuesta en un botón
 * function CommentActions({ commentId }) {
 *   const { setReplyingTo } = useCommentInputStore();
 *   
 *   return (
 *     <button onClick={() => setReplyingTo(commentId)}>
 *       Responder
 *     </button>
 *   );
 * }
 * 
 * @example
 * // Mostrar formulario de respuesta condicionalmente
 * function CommentItem({ comment }) {
 *   const { replyingTo, clearReplyingTo } = useCommentInputStore();
 *   const isReplying = replyingTo === comment.id;
 *   
 *   return (
 *     <div>
 *       <p>{comment.content}</p>
 *       {isReplying && (
 *         <ReplyForm 
 *           parentId={comment.id}
 *           onCancel={clearReplyingTo}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Limpiar respuesta después de enviar
 * function ReplyForm({ parentId }) {
 *   const { clearReplyingTo } = useCommentInputStore();
 *   const { mutate } = useAddComment(postId);
 *   
 *   const handleSubmit = (content) => {
 *     mutate({ content, parentId });
 *     clearReplyingTo(); // Cerrar formulario después de enviar
 *   };
 *   
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export const useCommentInputStore = create<CommentInputState>((set) => ({
  replyingTo: null,
  setReplyingTo: (commentId) => set({ replyingTo: commentId }),
  clearReplyingTo: () => set({ replyingTo: null }),
}));