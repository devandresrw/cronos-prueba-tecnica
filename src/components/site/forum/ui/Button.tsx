import styles from '@/components/site/forum/ui/css/Button.module.css';
import { ButtonProps } from '@/types/forum.ui.types'

export default function Button({
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${styles[shape]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
