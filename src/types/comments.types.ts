import { CommentDocument } from './firestore.types';

// ============================================
// TIPOS DE RESPUESTA DE ACCIONES
// ============================================

// Respuesta genérica de éxito/error
export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// TIPO PARA SERIALIZACIÓN DE COMENTARIOS
// ============================================

// Timestamp serializado para evitar problemas con Next.js
export interface SerializedTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Comentario con timestamps serializados
export interface SerializedCommentDocument extends Omit<CommentDocument, 'createdAt' | 'updatedAt'> {
  createdAt: SerializedTimestamp | null;
  updatedAt?: SerializedTimestamp | null;
}

// ============================================
// RESPUESTAS ESPECÍFICAS POR ACCIÓN
// ============================================

// Respuesta de getPostCommentsAction (usa SerializedCommentDocument)
export type GetPostCommentsResponse = ActionResponse<SerializedCommentDocument[]>;

// Respuesta de createCommentAction
export type CreateCommentResponse = ActionResponse;

// Respuesta de toggleLikeAction
export type ToggleLikeResponse = ActionResponse;

// Respuesta de deleteCommentAction
export type DeleteCommentResponse = ActionResponse;

// ============================================
// PARÁMETROS DE ACCIONES
// ============================================

// Parámetros para createCommentAction
export interface CreateCommentParams {
  postId: string;
  content: string;
  parentId?: string | null;
}

// Parámetros para toggleLikeAction
export interface ToggleLikeParams {
  postId: string;
  commentId: string;
}

// Parámetros para deleteCommentAction
export interface DeleteCommentParams {
  postId: string;
  commentId: string;
}