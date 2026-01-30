import styles from '@/components/site/root/forms-auth/css/Label.module.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export default function Label({ children, ...props }: LabelProps) {
  return (
    <label className={styles.label} {...props}>
      {children}
    </label>
  );
}
