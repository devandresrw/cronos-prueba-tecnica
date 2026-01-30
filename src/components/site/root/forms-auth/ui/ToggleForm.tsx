"use client";
import styles from '@/components/site/root/forms-auth/css/ToggleForm.module.css';
import { useToggleFormsAuth } from '@/stores/toggleFormsAuth.store';

export default function ToggleForm() {
  const { isSignUp, toggleForm } = useToggleFormsAuth();

  return (
    <div className={styles.container}>
      <p className={styles.text}>
        {isSignUp ? "¿Ya tienes una cuenta?" : "¿Nuevo en la plataforma?"}
        <button onClick={toggleForm} className={styles.button} type="button">
          {isSignUp ? "Volver al inicio de sesión" : "Crear una cuenta"}
        </button>
      </p>
    </div>
  );
}
