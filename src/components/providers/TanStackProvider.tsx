'use client'
import { useEffect, useRef } from 'react'
import { useIsFetching } from '@tanstack/react-query'

/**
 * Componente que monitorea el estado de React Query y emite un evento cuando está listo.
 * 
 * Este componente utiliza el hook `useIsFetching` de React Query para rastrear el número
 * de peticiones activas. Cuando todas las peticiones iniciales han finalizado (isFetching === 0),
 * dispara un evento personalizado 'app:ready' en el objeto window, útil para herramientas
 * de testing o para saber cuándo la aplicación ha terminado de cargar sus datos iniciales.
 * 
 * El componente ignora el primer montaje para evitar disparar el evento prematuramente.
 * 
 * @component
 * @returns {null} No renderiza ningún elemento en el DOM
 * 
 * @example
 * // Uso típico en el layout de la aplicación
 * <QueryClientProvider>
 *   <ReactQueryReady />
 *   <App />
 * </QueryClientProvider>
 * 
 * @example
 * // Escuchar el evento en tests o código externo
 * window.addEventListener('app:ready', () => {
 *   console.log('La aplicación ha terminado de cargar los datos');
 * });
 */
export default function ReactQueryReady() {
 const isFetching = useIsFetching()
 const mounted = useRef(false)

 useEffect(() => {
  if (!mounted.current) {
   mounted.current = true
   return
  }
  if (isFetching === 0) {
   window.dispatchEvent(new Event('app:ready'))
  }
 }, [isFetching])

 return null
}