import styles from '@/components/utils/css/container.module.css'

export default function WrapperSite({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.gradientOverlay}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}