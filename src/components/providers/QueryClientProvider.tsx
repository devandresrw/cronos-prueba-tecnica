'use client';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * Crea y configura una instancia de QueryClient con opciones predeterminadas optimizadas.
 * 
 * La configuración incluye:
 * - staleTime: Los datos se consideran frescos por 60 segundos
 * - retry: Solo reintenta una vez si falla una query
 * - refetchOnWindowFocus: Deshabilitado para evitar refetches innecesarios
 * 
 * @returns {QueryClient} Una nueva instancia de QueryClient configurada
 * 
 * @example
 * const client = makeQueryClient();
 * // client está listo para usarse con React Query
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Proveedor de React Query para la aplicación.
 * 
 * Este componente envuelve la aplicación con el contexto de React Query (TanStack Query),
 * proporcionando acceso al QueryClient en toda la jerarquía de componentes.
 * Utiliza useState para asegurar que solo se cree una instancia del QueryClient
 * durante el ciclo de vida del componente.
 * 
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {ReactNode} props.children - Los componentes hijos que tendrán acceso al QueryClient
 * @returns {JSX.Element} El proveedor de React Query con los hijos envueltos
 * 
 * @example
 * // Uso típico en el layout raíz de la aplicación
 * <QueryClientProvider>
 *   <App />
 * </QueryClientProvider>
 * 
 * @example
 * // Los componentes hijos pueden usar hooks de React Query
 * <QueryClientProvider>
 *   <MyComponent /> // Puede usar useQuery, useMutation, etc.
 * </QueryClientProvider>
 */
export default function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
}
