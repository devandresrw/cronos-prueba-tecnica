import Image from 'next/image';
import styles from '@/components/site/forum/ui/css/Avatar.module.css';
import Icon from '@/components/site/forum/ui/Icon';
import { AvatarProps } from '@/types/forum.ui.types';


export default function Avatar({ src, alt, size = 'md', shape = 'circle', className = '' }: AvatarProps) {
  if (!src) {
    return (
      <div className={`${styles.placeholder} ${styles[size]} ${styles[shape]} ${className}`}>
        <Icon name="person" className={styles.placeholderIcon} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={`${styles.avatar} ${styles[size]} ${styles[shape]} ${className}`}
      width={50}
      height={50}
    />
  );
}
