import { Timestamp } from 'firebase/firestore';

// ============================================
// USUARIOS (Colección /users)
// ============================================

// Documento de usuario en Firestore (colección /users)
export interface UserDocument {
  uid: string;
  displayName: string;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

// Tipo para crear un usuario (sin timestamps automáticos)
export type CreateUserDTO = Omit<UserDocument, 'createdAt' | 'updatedAt'>;

// Author es una referencia simplificada del usuario para usar en comentarios
export interface Author {
  uid: string;
  displayName: string;
}

// ============================================
// COMENTARIOS (Colección /posts/{postId}/comments)
// ============================================

export interface CommentDocument {
  id: string;
  postId: string;
  parentId: string | null; 
  content: string;
  author: Author;
  authorId: string; 
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  
  // Sistema de likes
  likeCount: number;
  likedBy: string[]; // Array de UIDs que dieron like
  
  // Respuestas
  replyCount: number;
  
  // Opcional: Estado del comentario
  isEdited?: boolean;
  isDeleted?: boolean;
  isOptimistic?: boolean; // UI only state
}

export type CreateCommentDTO = Omit<
  CommentDocument, 
  'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'likedBy' | 'replyCount'
>;

export interface CommentNode extends CommentDocument {
  children: CommentNode[];
}

// Nueva interface para operaciones de likes
export interface LikeAction {
  commentId: string;
  userId: string;
  action: 'like' | 'unlike';
}

// Interface para el estado del UI
export interface CommentUIState {
  isLiked: boolean; // Si el usuario actual dio like
  isReplying: boolean; // Si está abierto el formulario de respuesta
  showReplies: boolean; // Si se muestran las respuestas
}