import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserDocumentAction } from '@/actions/user.actions';

/**
 * Hook personalizado para obtener y gestionar el documento de usuario desde Firestore.
 * 
 * Este hook combina datos de la sesión de NextAuth con el documento de usuario almacenado
 * en Firestore. Utiliza React Query para cachear los datos y sincronizarlos automáticamente.
 * Proporciona información agregada sobre el usuario, priorizando datos de Firestore y
 * usando datos de sesión como fallback.
 * 
 * @hook
 * @returns {Object} Objeto con información del usuario y estados de carga
 * @returns {Object|null|undefined} returns.userDocument - Documento completo del usuario desde Firestore
 * @returns {string} returns.displayName - Nombre a mostrar (Firestore > sesión > "Usuario Invitado")
 * @returns {string} returns.avatar - URL del avatar del usuario (de la sesión)
 * @returns {boolean} returns.isLoading - Estado de carga (sesión o consulta de Firestore)
 * @returns {boolean} returns.isError - Indica si hubo error al obtener el documento
 * @returns {boolean} returns.isAuthenticated - Indica si el usuario está autenticado
 * @returns {string|undefined} returns.userId - ID del usuario autenticado
 * 
 * @example
 * // Uso en un componente
 * function UserProfile() {
 *   const { displayName, avatar, isLoading, isAuthenticated } = useUserDocument();
 *   
 *   if (isLoading) return <div>Cargando...</div>;
 *   if (!isAuthenticated) return <div>Por favor inicia sesión</div>;
 *   
 *   return (
 *     <div>
 *       <img src={avatar} alt={displayName} />
 *       <h2>{displayName}</h2>
 *     </div>
 *   );
 * }
 */
export const useUserDocument = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data: userDocument, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDocumentAction(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Mantener en caché por 5 minutos
  });

  // Combinamos la información: prioridad al documento de Firestore, fallback a la sesión
  const displayName = userDocument?.displayName || session?.user?.name || "Usuario Invitado";
  const avatar = session?.user?.image || ""; // Por ahora el avatar viene de la sesión (Google/etc)
  const isAuthenticated = status === 'authenticated';

  return {
    userDocument,
    displayName,
    avatar,
    isLoading: status === 'loading' || (!!userId && isLoading),
    isError,
    isAuthenticated,
    userId
  };
};
