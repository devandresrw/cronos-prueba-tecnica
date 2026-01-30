import Icon from '@/components/site/forum/ui/Icon';
import styles from '@/components/site/forum/video/css/VideoControls.module.css';

export default function VideoControls() {
  return (
    <div className={styles.controls}>
      <div className={styles.timeline}>
        <div className={styles.progress}></div>
        <div className={styles.thumb}></div>
      </div>
      <div className={styles.bar}>
        <div className={styles.left}>
          <Icon name="play_arrow" className={styles.icon} />
          <Icon name="skip_next" className={styles.icon} />
          <Icon name="volume_up" className={styles.icon} />
          <span className={styles.time}>12:45 / 38:20</span>
        </div>
        <div className={styles.right}>
          <Icon name="settings" className={styles.icon} />
          <Icon name="branding_watermark" className={styles.icon} />
          <Icon name="fullscreen" className={styles.icon} />
        </div>
      </div>
    </div>
  );
}
