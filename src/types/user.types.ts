import { UserDocument } from './firestore.types';

// ============================================
// TIPOS DE RESPUESTA DE ACCIONES
// ============================================

// Respuesta genérica de éxito/error para acciones de usuario
export interface UserActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// TIPO PARA SERIALIZACIÓN DE USUARIO
// ============================================

// Usuario con timestamps serializados como Date para Next.js
export interface SerializedUserDocument extends Omit<UserDocument, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================
// RESPUESTAS ESPECÍFICAS POR ACCIÓN
// ============================================

// Respuesta de getUserDocumentAction
export type GetUserDocumentResponse = SerializedUserDocument | null;