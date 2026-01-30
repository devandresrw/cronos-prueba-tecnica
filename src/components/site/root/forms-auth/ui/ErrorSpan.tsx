import styles from '@/components/site/root/forms-auth/css/Input.module.css';

interface ErrorSpanProps {
  error?: string;
}

export default function ErrorSpan({ error }: ErrorSpanProps) {
  if (!error) return null;
  
  return (
    <span className={styles.errorMessage}>{error}</span>
  );
}
