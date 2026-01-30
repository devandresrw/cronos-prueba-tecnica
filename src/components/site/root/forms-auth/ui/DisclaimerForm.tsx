"use client";
import styles from '@/components/site/root/forms-auth/css/DisclaimerForm.module.css';
import { useToggleFormsAuth } from '@/stores/toggleFormsAuth.store';


export default function DisclaimerForm() {
  const { isSignUp } = useToggleFormsAuth();

  return (
    <div className={styles.container}>
      <div className={styles.glow}></div>

      <div className={styles.content}>

        <h1 className={styles.title}>
          {isSignUp ? (
            <>Únete al siguiente<br/><span className={styles.highlight}>frontera</span> de activos.</>
          ) : (
            <>Únete al <span className={styles.highlight}>Futuro</span> de las Finanzas.</>
          )}
        </h1>

        <p className={styles.text}>
          {isSignUp
            ? "Experimente el ecosistema de inversión futurista diseñado para traders de alto rendimiento."
            : "El panel definitivo para inversores modernos. Rastrea, analiza y optimiza tu cartera con precisión neón."
          }
        </p>
      </div>
    </div>
  );
}
