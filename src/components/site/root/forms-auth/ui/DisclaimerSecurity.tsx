import styles from '@/components/site/root/forms-auth/css/DisclaimerSecurity.module.css';

export default function DisclaimerSecurity() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.line}></div>
        <span className={styles.title}>Seguridad verificada</span>
        <div className={styles.line}></div>
      </div>
      <div className={styles.badges}>
        <div className={styles.badge}>
          <span className={`material-symbols-outlined ${styles.icon}`}>verified_user</span>
          <span className={styles.badgeText}>SSL Encriptado</span>
        </div>
        <div className={styles.badge}>
          <span className={`material-symbols-outlined ${styles.icon}`}>shield</span>
          <span className={styles.badgeText}>Listo para biometría</span>
        </div>
      </div>
    </div>
  );
}
