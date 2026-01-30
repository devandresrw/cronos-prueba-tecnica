import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  runTransaction,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CommentDocument, Author } from '@/types/firestore.types';

const COLLECTION_NAME = 'posts';
const SUB_COLLECTION_NAME = 'comments';

export const CommentsService = {

  /**
   * Obtiene todos los comentarios de un post ordenados por fecha de creación.
   */
  getCommentsByPostId: async (postId: string): Promise<CommentDocument[]> => {
    try {
      // ---------------------------------------------------------
      // SERVER SIDE (Admin SDK)
      // ---------------------------------------------------------
      if (typeof window === 'undefined') {
        const { adminDb } = await import('@/lib/firebase-admin');
        if (!adminDb) throw new Error("Admin SDK not initialized");

        const snapshot = await adminDb
          .collection(COLLECTION_NAME)
          .doc(postId)
          .collection(SUB_COLLECTION_NAME)
          .orderBy('createdAt', 'desc')
          .get();

        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CommentDocument[];
      }

      // ---------------------------------------------------------
      // CLIENT SIDE (Client SDK)
      // ---------------------------------------------------------
      const commentsRef = collection(db, COLLECTION_NAME, postId, SUB_COLLECTION_NAME);
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      
      const comments: CommentDocument[] = [];
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
        } as CommentDocument);
      });

      return comments;
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo comentario o respuesta.
   */
  createComment: async (
    postId: string, 
    content: string, 
    author: Author, 
    parentId: string | null = null
  ): Promise<void> => {
    // Objeto base
    const baseData = {
      postId,
      parentId,
      content,
      author,
      authorId: author.uid,
      likeCount: 0,
      likedBy: [],
      replyCount: 0,
      isDeleted: false,
      isEdited: false
    };

    try {
      // ---------------------------------------------------------
      // SERVER SIDE (Admin SDK)
      // ---------------------------------------------------------
      if (typeof window === 'undefined') {
        const { adminDb } = await import('@/lib/firebase-admin');
        // Importamos FieldValue dinámicamente
        const { FieldValue } = await import('firebase-admin/firestore');
        
        if (!adminDb) throw new Error("Admin SDK not initialized");

        const newCommentData = {
          ...baseData,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };

        const commentsRef = adminDb.collection(COLLECTION_NAME).doc(postId).collection(SUB_COLLECTION_NAME);

        if (!parentId) {
          await commentsRef.add(newCommentData);
        } else {
          await adminDb.runTransaction(async (t) => {
            const parentRef = commentsRef.doc(parentId);
            const parentDoc = await t.get(parentRef);
            
            if (!parentDoc.exists) {
              throw new Error("El comentario padre no existe.");
            }

            const newCommentRef = commentsRef.doc();
            t.set(newCommentRef, newCommentData);
            
            t.update(parentRef, {
              replyCount: FieldValue.increment(1)
            });
          });
        }
        return;
      }

      // ---------------------------------------------------------
      // CLIENT SIDE (Client SDK)
      // ---------------------------------------------------------
      const commentsRef = collection(db, COLLECTION_NAME, postId, SUB_COLLECTION_NAME);
      const newCommentData = {
        ...baseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (!parentId) {
        await addDoc(commentsRef, newCommentData);
      } else {
        await runTransaction(db, async (transaction) => {
          const parentCommentRef = doc(db, COLLECTION_NAME, postId, SUB_COLLECTION_NAME, parentId);
          const parentSnapshot = await transaction.get(parentCommentRef);

          if (!parentSnapshot.exists()) {
            throw new Error("El comentario al que intentas responder ya no existe.");
          }

          const newCommentRef = doc(commentsRef);
          transaction.set(newCommentRef, newCommentData);
          
          transaction.update(parentCommentRef, {
            replyCount: increment(1)
          });
        });
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  /**
   * Alterna el like de un usuario en un comentario.
   */
  toggleLike: async (
    postId: string, 
    commentId: string, 
    userId: string
  ): Promise<void> => {
    try {
      // ---------------------------------------------------------
      // SERVER SIDE (Admin SDK)
      // ---------------------------------------------------------
      if (typeof window === 'undefined') {
        const { adminDb } = await import('@/lib/firebase-admin');
        const { FieldValue } = await import('firebase-admin/firestore');
        if (!adminDb) throw new Error("Admin SDK not initialized");

        const commentRef = adminDb.collection(COLLECTION_NAME).doc(postId).collection(SUB_COLLECTION_NAME).doc(commentId);

        await adminDb.runTransaction(async (t) => {
          const docSnap = await t.get(commentRef);
          if (!docSnap.exists) throw new Error("Comentario no encontrado");

          const data = docSnap.data();
          const likedBy = data?.likedBy || [];
          const hasLiked = likedBy.includes(userId);

          if (hasLiked) {
             t.update(commentRef, {
               likeCount: FieldValue.increment(-1),
               likedBy: FieldValue.arrayRemove(userId)
             });
          } else {
             t.update(commentRef, {
               likeCount: FieldValue.increment(1),
               likedBy: FieldValue.arrayUnion(userId)
             });
          }
        });
        return;
      }

      // ---------------------------------------------------------
      // CLIENT SIDE (Client SDK)
      // ---------------------------------------------------------
      const commentRef = doc(db, COLLECTION_NAME, postId, SUB_COLLECTION_NAME, commentId);

      await runTransaction(db, async (transaction) => {
        const commentDoc = await transaction.get(commentRef);
        
        if (!commentDoc.exists()) {
          throw new Error("El comentario no existe.");
        }

        const data = commentDoc.data();
        const likedBy = data.likedBy || [];
        const hasLiked = likedBy.includes(userId);

        if (hasLiked) {
          transaction.update(commentRef, {
            likeCount: increment(-1),
            likedBy: arrayRemove(userId)
          });
        } else {
          transaction.update(commentRef, {
            likeCount: increment(1),
            likedBy: arrayUnion(userId)
          });
        }
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  /**
   * Realiza un "Soft Delete" del comentario.
   * En servidor (Admin) verifica que el userId coincida con el authorId.
   */
  softDeleteComment: async (
    postId: string, 
    commentId: string,
    userId?: string 
  ): Promise<void> => {
    try {
      // ---------------------------------------------------------
      // SERVER SIDE (Admin SDK)
      // ---------------------------------------------------------
      if (typeof window === 'undefined') {
        const { adminDb } = await import('@/lib/firebase-admin');
        const { FieldValue } = await import('firebase-admin/firestore');
        if (!adminDb) throw new Error("Admin SDK not initialized");

        const commentRef = adminDb.collection(COLLECTION_NAME).doc(postId).collection(SUB_COLLECTION_NAME).doc(commentId);

        // Verificamos propiedad antes de borrar
        if (userId) {
           const docSnap = await commentRef.get();
           if (!docSnap.exists) throw new Error("Comment not found");
           if (docSnap.data()?.authorId !== userId) {
             throw new Error("Unauthorized: You can only delete your own comments");
           }
        }

        await commentRef.update({
          content: "Comentario eliminado por el usuario",
          isDeleted: true,
          updatedAt: FieldValue.serverTimestamp()
        });
        return;
      }

      // ---------------------------------------------------------
      // CLIENT SIDE (Client SDK)
      // ---------------------------------------------------------
      const commentRef = doc(db, COLLECTION_NAME, postId, SUB_COLLECTION_NAME, commentId);
      // En cliente confiamos en las reglas de seguridad de Firestore para la autorización
      
      await updateDoc(commentRef, {
        content: "Comentario eliminado por el usuario",
        isDeleted: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};