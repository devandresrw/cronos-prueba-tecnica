import styles from '@/components/site/root/forms-auth/css/Checkbox.module.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

export default function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={id}
        className={styles.checkbox}
        {...props}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}
