import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { AuthCredentials } from '@/types/auth.types';

/**
 * Configuración de NextAuth para autenticación con Firebase.
 * 
 * Este objeto configura NextAuth para usar Firebase Authentication como proveedor
 * de credenciales. Implementa autenticación basada en email/password con JWT
 * para gestión de sesiones.
 * 
 * Características:
 * - Proveedor de credenciales (email/password)
 * - Autenticación mediante Firebase Authentication
 * - Estrategia de sesión basada en JWT
 * - Callbacks personalizados para agregar datos del usuario al token y sesión
 * - Página de inicio de sesión personalizada en la ruta raíz
 * 
 * @constant
 * @type {NextAuthConfig}
 * @property {Array} providers - Array con CredentialsProvider configurado para Firebase
 * @property {Object} session - Configuración de sesión con estrategia JWT
 * @property {Object} pages - Rutas personalizadas para páginas de autenticación
 * @property {string} secret - Secreto para firmar tokens (desde variable de entorno)
 * @property {Object} callbacks - Callbacks para personalizar JWT y sesión
 * 
 * @see {@link https://next-auth.js.org/configuration/options|NextAuth Options}
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Función de autorización que valida las credenciales del usuario.
       * 
       * Autentica al usuario usando Firebase Authentication con email y contraseña.
       * Si la autenticación es exitosa, retorna los datos del usuario para la sesión.
       * 
       * @async
       * @param {Record<string, any>} credentials - Objeto con email y password del usuario
       * @param {string} credentials.email - Email del usuario
       * @param {string} credentials.password - Contraseña del usuario
       * @returns {Promise<Object|null>} Objeto de usuario si la autenticación es exitosa, null en caso contrario
       * @returns {string} returns.id - UID del usuario en Firebase
       * @returns {string|null} returns.email - Email del usuario
       * @returns {string|null} returns.name - Nombre del usuario (displayName de Firebase)
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const authCredentials: AuthCredentials = {
            email: credentials.email as string,
            password: credentials.password as string,
          };

          const userCredential = await signInWithEmailAndPassword(
            auth,
            authCredentials.email,
            authCredentials.password
          );

          if (userCredential.user) {
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            };
          }
          return null;
        } catch (error: unknown) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    /**
     * Callback ejecutado cuando se crea o actualiza un JWT.
     * 
     * Agrega el ID del usuario (UID de Firebase) al token JWT cuando el usuario
     * inicia sesión. Este ID se mantiene en el token para futuras solicitudes.
     * 
     * @async
     * @param {Object} params - Parámetros del callback
     * @param {Object} params.token - Token JWT existente
     * @param {Object} [params.user] - Objeto de usuario (solo disponible en el primer login)
     * @returns {Promise<Object>} Token JWT actualizado con el ID del usuario
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    /**
     * Callback ejecutado cuando se accede a la sesión del usuario.
     * 
     * Agrega el ID del usuario desde el token JWT al objeto de sesión,
     * haciéndolo accesible en el cliente mediante useSession().
     * 
     * @async
     * @param {Object} params - Parámetros del callback
     * @param {Object} params.session - Objeto de sesión
     * @param {Object} params.token - Token JWT decodificado
     * @returns {Promise<Object>} Sesión actualizada con el ID del usuario
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;