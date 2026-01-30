import { create } from 'zustand';

/**
 * Tipo que define los tipos de notificaciones disponibles en la UI.
 * 
 * @typedef {('success' | 'error' | null)} NotificationType
 * - 'success': Notificación de éxito (color verde)
 * - 'error': Notificación de error (color rojo)
 * - null: Sin notificación activa
 */
type NotificationType = 'success' | 'error' | null;

/**
 * Estado global de la interfaz de usuario.
 * 
 * Define la estructura del estado que controla elementos globales de la UI como
 * indicadores de carga y notificaciones temporales.
 * 
 * @interface UIState
 * @property {boolean} isGlobalLoading - Indica si hay una operación de carga global activa
 * @property {Object} notification - Estado de la notificación actual
 * @property {NotificationType} notification.type - Tipo de notificación ('success', 'error', o null)
 * @property {string | null} notification.message - Mensaje de la notificación o null si no hay notificación
 * @property {Function} setGlobalLoading - Establece el estado de carga global
 * @property {Function} showNotification - Muestra una notificación con tipo y mensaje
 * @property {Function} clearNotification - Limpia la notificación actual
 */
interface UIState {
  isGlobalLoading: boolean;
  notification: {
    type: NotificationType;
    message: string | null;
  };
  setGlobalLoading: (isLoading: boolean) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  clearNotification: () => void;
}

/**
 * Store de Zustand para gestionar el estado global de la interfaz de usuario.
 * 
 * Este store centraliza el control de elementos globales de la UI como indicadores
 * de carga y notificaciones (toast messages). Es utilizado por múltiples componentes
 * y hooks para mostrar feedback visual al usuario durante operaciones asíncronas.
 * 
 * Características:
 * - Control de loading global para operaciones pesadas
 * - Sistema de notificaciones con tipos success/error
 * - Gestión automática del estado de notificaciones
 * - Sin persistencia (estado en memoria)
 * 
 * @constant
 * @type {Function}
 * @returns {UIState} Objeto con el estado y acciones del store
 * @returns {boolean} returns.isGlobalLoading - true si hay una carga global activa
 * @returns {Object} returns.notification - Objeto con tipo y mensaje de notificación
 * @returns {Function} returns.setGlobalLoading - Activa/desactiva el loading global
 * @returns {Function} returns.showNotification - Muestra una notificación de éxito o error
 * @returns {Function} returns.clearNotification - Oculta la notificación actual
 * 
 * @example
 * // Mostrar loading durante una operación
 * function SaveButton() {
 *   const { setGlobalLoading, showNotification } = useUIStore();
 *   
 *   const handleSave = async () => {
 *     setGlobalLoading(true);
 *     try {
 *       await saveData();
 *       showNotification('success', 'Datos guardados correctamente');
 *     } catch (error) {
 *       showNotification('error', 'Error al guardar los datos');
 *     } finally {
 *       setGlobalLoading(false);
 *     }
 *   };
 *   
 *   return <button onClick={handleSave}>Guardar</button>;
 * }
 * 
 * @example
 * // Mostrar indicador de carga global
 * function GlobalLoader() {
 *   const { isGlobalLoading } = useUIStore();
 *   
 *   if (!isGlobalLoading) return null;
 *   
 *   return (
 *     <div className="fixed inset-0 bg-black/50">
 *       <div className="loading-spinner">Cargando...</div>
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Componente de notificaciones
 * function NotificationToast() {
 *   const { notification, clearNotification } = useUIStore();
 *   
 *   if (!notification.type) return null;
 *   
 *   return (
 *     <div className={`toast ${notification.type}`}>
 *       {notification.message}
 *       <button onClick={clearNotification}>×</button>
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Uso en mutations de React Query
 * const mutation = useMutation({
 *   mutationFn: createComment,
 *   onMutate: () => {
 *     useUIStore.getState().setGlobalLoading(true);
 *   },
 *   onSuccess: () => {
 *     useUIStore.getState().showNotification('success', 'Comentario publicado');
 *   },
 *   onError: () => {
 *     useUIStore.getState().showNotification('error', 'Error al publicar');
 *   },
 *   onSettled: () => {
 *     useUIStore.getState().setGlobalLoading(false);
 *   }
 * });
 */
export const useUIStore = create<UIState>((set) => ({
  isGlobalLoading: false,
  notification: {
    type: null,
    message: null,
  },
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
  showNotification: (type, message) => set({ notification: { type, message } }),
  clearNotification: () => set({ notification: { type: null, message: null } }),
}));
