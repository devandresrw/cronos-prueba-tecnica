import styles from '@/components/site/root/forms-auth/css/Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  error?: string;
}

export default function Input({ icon, error, ...props }: InputProps) {
  return (
    <>
      <div className={styles.container}>
        {icon && (
          <span className={`material-symbols-outlined ${styles.icon}`}>
            {icon}
          </span>
        )}
        <input
          className={`${styles.input} ${icon ? styles.inputWithIcon : ''} ${error ? styles.inputError : ''}`}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </>
  );
}