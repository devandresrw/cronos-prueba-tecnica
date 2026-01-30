import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Estado para gestionar la alternancia entre formularios de autenticación.
 * 
 * Define la estructura del estado que controla qué formulario de autenticación
 * (registro o inicio de sesión) está actualmente visible en la interfaz.
 * 
 * @interface ToggleFormsAuthState
 * @property {boolean} isSignUp - Indica si el formulario de registro está activo (true) o el de inicio de sesión (false)
 * @property {Function} toggleForm - Alterna entre los formularios de registro e inicio de sesión
 * @property {Function} setIsSignUp - Establece directamente qué formulario mostrar
 */
interface ToggleFormsAuthState {
  /** Indica si el formulario de registro está activo (true) o el de inicio de sesión (false) */
  isSignUp: boolean;
  /** Alterna entre los formularios de registro e inicio de sesión */
  toggleForm: () => void;
  /** Establece directamente el formulario activo */
  setIsSignUp: (value: boolean) => void;
}

/**
 * Store de Zustand para gestionar la alternancia entre formularios de autenticación.
 * 
 * Este store controla qué formulario de autenticación (Sign Up o Sign In) está visible
 * en la interfaz. Utiliza el middleware de persistencia de Zustand para guardar el estado
 * en sessionStorage, manteniendo la preferencia del usuario durante la sesión del navegador
 * pero eliminándola al cerrar la pestaña.
 * 
 * Características:
 * - Persistencia en sessionStorage (se limpia al cerrar la pestaña)
 * - Alternancia sencilla entre formularios con toggleForm()
 * - Control directo del estado con setIsSignUp()
 * - Estado inicial en Sign In (isSignUp: false)
 * 
 * @constant
 * @type {Function}
 * @returns {ToggleFormsAuthState} Objeto con el estado y acciones del store
 * @returns {boolean} returns.isSignUp - true si está en modo registro, false si está en modo inicio de sesión
 * @returns {Function} returns.toggleForm - Función para alternar entre los dos formularios
 * @returns {Function} returns.setIsSignUp - Función para establecer directamente el formulario activo
 * 
 * @example
 * // Uso básico: renderizar formularios condicionalmente
 * function AuthPage() {
 *   const { isSignUp, toggleForm } = useToggleFormsAuth();
 *   
 *   return (
 *     <div>
 *       {isSignUp ? <FormSignUp /> : <FormSignIn />}
 *       <button onClick={toggleForm}>
 *         {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
 *       </button>
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Establecer formulario específico desde un enlace
 * function NavigationMenu() {
 *   const { setIsSignUp } = useToggleFormsAuth();
 *   
 *   return (
 *     <nav>
 *       <button onClick={() => setIsSignUp(false)}>Iniciar Sesión</button>
 *       <button onClick={() => setIsSignUp(true)}>Registrarse</button>
 *     </nav>
 *   );
 * }
 * 
 * @example
 * // Mostrar título dinámico según el formulario activo
 * function AuthHeader() {
 *   const { isSignUp } = useToggleFormsAuth();
 *   
 *   return (
 *     <h1>
 *       {isSignUp ? 'Crear nueva cuenta' : 'Bienvenido de nuevo'}
 *     </h1>
 *   );
 * }
 * 
 * @example
 * // Persistencia automática: el estado se mantiene en recargas
 * // Si el usuario está en el formulario de registro y recarga la página,
 * // se mantendrá en el formulario de registro gracias a sessionStorage
 */
export const useToggleFormsAuth = create<ToggleFormsAuthState>()(
  persist(
    (set) => ({
      isSignUp: false,
      
      toggleForm: () =>
        set((state) => ({
          isSignUp: !state.isSignUp,
        })),
      
      setIsSignUp: (value: boolean) =>
        set(() => ({
          isSignUp: value,
        })),
    }),
    {
      name: 'auth-form-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
