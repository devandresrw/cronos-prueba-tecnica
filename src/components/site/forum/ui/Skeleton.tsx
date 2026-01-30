import styles from '@/components/site/forum/ui/css/Skeleton.module.css';
import {SkeletonProps} from '@/types/forum.ui.types'


export default function Skeleton({ width, height, className = '', borderRadius = '0.25rem' }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}
