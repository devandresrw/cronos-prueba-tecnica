'use server';

import { UsersService } from '@/lib/services/users.service';
import { UserDocument } from '@/types/firestore.types';
import { GetUserDocumentResponse, SerializedUserDocument } from '@/types/user.types';
import { Timestamp } from 'firebase/firestore';

/**
 * Serializa un documento de usuario de Firestore convirtiéndolo en un formato compatible con Next.js.
 * 
 * Transforma los Timestamps de Firestore en objetos Date nativos de JavaScript, permitiendo
 * que los datos sean serializables y puedan ser enviados desde el servidor al cliente.
 * 
 * @param {UserDocument} user - El documento de usuario de Firestore con timestamps
 * @returns {SerializedUserDocument} El documento de usuario serializado con objetos Date
 * 
 * @example
 * const firestoreUser = { uid: '123', email: 'user@example.com', createdAt: Timestamp.now() };
 * const serializedUser = serializeUser(firestoreUser);
 * // serializedUser.createdAt es ahora un objeto Date
 */
function serializeUser(user: UserDocument): SerializedUserDocument {
  return {
    ...user,
    createdAt: user.createdAt instanceof Timestamp 
      ? user.createdAt.toDate() 
      : user.createdAt instanceof Date 
        ? user.createdAt 
        : new Date(user.createdAt),
    updatedAt: user.updatedAt 
      ? user.updatedAt instanceof Timestamp 
        ? user.updatedAt.toDate() 
        : user.updatedAt instanceof Date 
          ? user.updatedAt 
          : new Date(user.updatedAt)
      : undefined,
  };
}

/**
 * Obtiene el documento de un usuario desde Firestore por su UID.
 * 
 * Esta es una Server Action de Next.js que recupera los datos de un usuario específico
 * desde Firestore, los serializa para compatibilidad con el cliente y maneja errores
 * de forma segura.
 * 
 * @async
 * @param {string} uid - El identificador único del usuario (UID) en Firebase Authentication
 * @returns {Promise<GetUserDocumentResponse>} Una promesa que resuelve con el documento de usuario
 *                                             serializado o null si no se encuentra o hay un error
 * 
 * @throws Captura cualquier error y retorna null en lugar de propagarlo
 * 
 * @example
 * // Uso en un componente del cliente
 * const userData = await getUserDocumentAction('user-uid-123');
 * if (userData) {
 *   console.log(`Usuario: ${userData.email}`);
 * }
 * 
 * @example
 * // Manejo cuando el usuario no existe
 * const userData = await getUserDocumentAction('non-existent-uid');
 * if (!userData) {
 *   console.log('Usuario no encontrado');
 * }
 */
export async function getUserDocumentAction(uid: string): Promise<GetUserDocumentResponse> {
  try {
    const user = await UsersService.getUserById(uid);
    
    if (!user) return null;
    
    return serializeUser(user);
    
  } catch (error) {
    console.error('Error in getUserDocumentAction:', error);
    return null;
  }
}