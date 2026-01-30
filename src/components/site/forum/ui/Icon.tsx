import styles from '@/components/site/forum/ui/css/Icon.module.css';
import {IconProps} from '@/types/forum.ui.types'


export default function Icon({ name, className = '', filled = false, ...props }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${styles.icon} ${filled ? styles.filled : ''} ${className}`}
      {...props}
    >
      {name}
    </span>
  );
}