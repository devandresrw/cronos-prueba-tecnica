'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

/**
 * Proveedor de sesión de autenticación para la aplicación.
 * 
 * Este componente envuelve el SessionProvider de NextAuth.js, proporcionando
 * el contexto de sesión de autenticación a toda la jerarquía de componentes.
 * Permite que los componentes hijos accedan a la información de la sesión del
 * usuario mediante hooks como useSession().
 * 
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {React.ReactNode} props.children - Los componentes hijos que tendrán acceso al contexto de sesión
 * @returns {JSX.Element} El proveedor de sesión de NextAuth con los hijos envueltos
 * 
 * @example
 * // Uso típico en el layout raíz de la aplicación
 * <SessionProvider>
 *   <App />
 * </SessionProvider>
 * 
 * @example
 * // Los componentes hijos pueden acceder a la sesión
 * <SessionProvider>
 *   <MyComponent /> // Puede usar useSession() para obtener datos del usuario
 * </SessionProvider>
 */
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
