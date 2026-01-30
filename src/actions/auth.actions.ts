'use server';

import { signIn, signOut } from '@/auth';
import { signInSchema, type SignInFormData } from '@/lib/schemas/sign-in.schema';
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/sign-up.schema';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UsersService } from '@/lib/services/users.service';
import type {
  LoginActionResponse,
  RegisterActionResponse,
  FirebaseAuthError,
  NextAuthError,
} from '@/types/auth.types';

/**
 * Acción de servidor para iniciar sesión mediante credenciales (email y password).
 * Valida los datos del formulario con Zod antes de intentar la autenticación.
 * 
 * @param {SignInFormData} formData - Datos del formulario de inicio de sesión
 * @param {string} formData.email - Correo electrónico del usuario
 * @param {string} formData.password - Contraseña del usuario
 * 
 * @returns {Promise<LoginActionResponse>} Objeto con el resultado de la operación:
 * - Si success es true: autenticación exitosa
 * - Si success es false: puede incluir 'errors' (errores de validación) o 'message' (error de autenticación)
 * 
 * @throws {Error} Re-lanza el error si no es un error conocido de NextAuth
 * 
 * @example
 * const result = await loginAction({ email: 'user@example.com', password: 'password123' });
 * if (result.success) {
 *   // Usuario autenticado correctamente
 * } else {
 *   // Manejar errores de validación o autenticación
 *   console.error(result.errors || result.message);
 * }
 */
export async function loginAction(formData: SignInFormData): Promise<LoginActionResponse> {
  // Validar datos con Zod
  const validatedFields = signInSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      // NextAuth lanza errores con el tipo en error.type
      const authError = error as NextAuthError;
      if (authError.type === 'CredentialsSignin') {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: false, message: 'Something went wrong' };
    }
    throw error;
  }
}

/**
 * Acción de servidor para registrar un nuevo usuario en el sistema.
 * Realiza las siguientes operaciones:
 * 1. Valida los datos del formulario con Zod
 * 2. Crea el usuario en Firebase Authentication
 * 3. Actualiza el perfil con el nombre completo
 * 4. Guarda la información del usuario en Firestore
 * 5. Inicia sesión automáticamente al usuario
 * 
 * @param {SignUpFormData} formData - Datos del formulario de registro
 * @param {string} formData.fullname - Nombre completo del usuario
 * @param {string} formData.email - Correo electrónico del usuario
 * @param {string} formData.password - Contraseña del usuario
 * 
 * @returns {Promise<RegisterActionResponse>} Objeto con el resultado de la operación:
 * - Si success es true: registro e inicio de sesión exitosos
 * - Si success es false: puede incluir 'errors' (errores de validación) o 'message' (error específico)
 * 
 * @throws {Error} Re-lanza el error si no es un error conocido de Firebase
 * 
 * @example
 * const result = await registerAction({ 
 *   fullname: 'John Doe', 
 *   email: 'john@example.com', 
 *   password: 'securePassword123' 
 * });
 * if (result.success) {
 *   // Usuario registrado y autenticado
 * } else if (result.message === 'This email is already registered') {
 *   // Email ya existe en el sistema
 * }
 * 
 * @remarks
 * Posibles mensajes de error:
 * - 'This email is already registered': El email ya está en uso
 * - 'Password is too weak': La contraseña no cumple los requisitos mínimos
 * - 'Invalid email address': El formato del email es inválido
 * - 'Registration failed. Please try again': Error genérico de registro
 */
export async function registerAction(formData: SignUpFormData): Promise<RegisterActionResponse> {
  // Validar datos con Zod
  const validatedFields = signUpSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullname, email, password } = validatedFields.data;

  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Actualizar el perfil con el nombre
    await updateProfile(userCredential.user, {
      displayName: fullname,
    });

    // Guardar información del usuario en Firestore (ahora el usuario está autenticado)
    await UsersService.createUser({
      uid: userCredential.user.uid,
      displayName: fullname,
    });

    // Iniciar sesión para que el usuario esté autenticado en Firestore
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      const firebaseError = error as FirebaseAuthError;
      
      // Manejar errores específicos de Firebase
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          return { success: false, message: 'This email is already registered' };
        case 'auth/weak-password':
          return { success: false, message: 'Password is too weak' };
        case 'auth/invalid-email':
          return { success: false, message: 'Invalid email address' };
        default:
          return { success: false, message: 'Registration failed. Please try again' };
      }
    }
    throw error;
  }
}

/**
 * Acción de servidor para cerrar la sesión del usuario actual.
 * Cierra la sesión tanto en el cliente como en el servidor y redirige al usuario a la página principal.
 * 
 * @returns {Promise<void>} Promise que se resuelve cuando la sesión se cierra completamente
 * 
 * @example
 * await logoutAction();
 * // El usuario será redirigido a la página principal ('/') automáticamente
 * 
 * @remarks
 * Esta función utiliza NextAuth para cerrar la sesión y realiza una redirección automática a '/'
 */
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}