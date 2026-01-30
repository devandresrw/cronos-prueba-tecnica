import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserDocument, CreateUserDTO } from '@/types/firestore.types';

const COLLECTION_NAME = 'users';

export const UsersService = {
  /**
   * Crea o actualiza un documento de usuario en Firestore
   * @param userData Datos del usuario (uid, displayName)
   * @returns Promise<void>
   */
  createUser: async (userData: CreateUserDTO): Promise<void> => {
    try {
      // En el servidor, usar Admin SDK
      if (typeof window === 'undefined') {
        const { adminDb } = await import('@/lib/firebase-admin');
        if (!adminDb) {
          throw new Error('Firebase Admin SDK is not initialized. Cannot create user on server.');
        }
        const userRef = adminDb.collection(COLLECTION_NAME).doc(userData.uid);
        
        await userRef.set({
          uid: userData.uid,
          displayName: userData.displayName,
          createdAt: new Date(),
        }, { merge: true });
        
        return;
      }
      
      // En el cliente, usar Firebase client SDK
      const userRef = doc(db, COLLECTION_NAME, userData.uid);
      
      await setDoc(userRef, {
        uid: userData.uid,
        displayName: userData.displayName,
        createdAt: new Date(),
      }, { merge: true });
      
    } catch (error) {
      console.error('Error creating user in Firestore:', error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por su UID
   * @param uid ID del usuario
   * @returns Promise<UserDocument | null>
   */
  getUserById: async (uid: string): Promise<UserDocument | null> => {
    try {
      // En el servidor, usar Admin SDK
      if (typeof window === 'undefined') {
        const { adminDb } = await import('@/lib/firebase-admin');
        if (adminDb) {
          const userRef = adminDb.collection(COLLECTION_NAME).doc(uid);
          const snapshot = await userRef.get();
          
          if (!snapshot.exists) return null;
          
          return snapshot.data() as UserDocument;
        }
      }
      
      // En el cliente, usar Firebase client SDK
      const userRef = doc(db, COLLECTION_NAME, uid);
      const snapshot = await getDoc(userRef);
      
      if (!snapshot.exists()) return null;
      
      return snapshot.data() as UserDocument;
      
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  /**
   * Actualiza el nombre de usuario en Firestore
   * @param uid ID del usuario
   * @param displayName Nuevo nombre a mostrar
   * @returns Promise<void>
   */
  updateUserDisplayName: async (uid: string, displayName: string): Promise<void> => {
    try {
      // En el servidor, usar Admin SDK
      if (typeof window === 'undefined') {
        const { adminDb } = await import('@/lib/firebase-admin');
        if (adminDb) {
          const userRef = adminDb.collection(COLLECTION_NAME).doc(uid);
          
          await userRef.set({
            displayName,
            updatedAt: new Date(),
          }, { merge: true });
          
          return;
        }
      }
      
      // En el cliente, usar Firebase client SDK
      const userRef = doc(db, COLLECTION_NAME, uid);
      
      await setDoc(userRef, {
        displayName,
        updatedAt: new Date(),
      }, { merge: true });
      
    } catch (error) {
      console.error('Error updating user display name:', error);
      throw error;
    }
  },
};