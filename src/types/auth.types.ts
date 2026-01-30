// src/types/auth.types.ts

// ============================================================================
// Action Response Types
// ============================================================================

/** Respuesta exitosa de una acción de autenticación */
export type AuthSuccessResponse = {
  success: true;
};

/** Respuesta de error con errores de validación de campos */
export type AuthValidationErrorResponse<T = Record<string, string[]>> = {
  success: false;
  errors: T;
};

/** Respuesta de error con mensaje general */
export type AuthErrorResponse = {
  success: false;
  message: string;
};

/** Respuesta de la acción de login */
export type LoginActionResponse =
  | AuthSuccessResponse
  | AuthValidationErrorResponse<{
      email?: string[];
      password?: string[];
      remember?: string[];
    }>
  | AuthErrorResponse;

/** Respuesta de la acción de registro */
export type RegisterActionResponse =
  | AuthSuccessResponse
  | AuthValidationErrorResponse<{
      fullname?: string[];
      email?: string[];
      password?: string[];
      terms?: string[];
    }>
  | AuthErrorResponse;

// ============================================================================
// NextAuth Types (usados internamente, los tipos de módulo están en next-auth.d.ts)
// ============================================================================

/** Credenciales para el inicio de sesión */
export type AuthCredentials = {
  email: string;
  password: string;
};

// ============================================================================
// Firebase Error Types
// ============================================================================

/** Códigos de error de Firebase Authentication */
export type FirebaseAuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed';

/** Error de Firebase con código */
export type FirebaseAuthError = Error & {
  code: FirebaseAuthErrorCode;
};

/** Resultado de la creación de usuario */
export type CreateUserResult = {
  uid: string;
  displayName: string;
  email: string | null;
};

// ============================================================================
// NextAuth Error Types
// ============================================================================

/** Tipos de error de NextAuth */
export type NextAuthErrorType = 'CredentialsSignin' | 'CallbackRouteError' | 'SignInError';

/** Error de NextAuth con tipo */
export type NextAuthError = Error & {
  type: NextAuthErrorType;
};