import styles from '@/components/site/root/forms-auth/css/FormStament.module.css';

interface FormStamentProps {
  title: string;
  subtitle: string;
}

export default function FormStament({ title, subtitle }: FormStamentProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
