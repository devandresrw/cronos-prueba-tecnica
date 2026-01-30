'use client';

import VideoControls from '@/components/site/forum/video/VideoControls';
import Button from '@/components/site/forum/ui/Button';
import Icon from '@/components/site/forum/ui/Icon';
import styles from '@/components/site/forum/video/css/VideoPlayer.module.css';

export default function VideoPlayer() {
  return (
    <>
      <div className={styles.loadingBar}></div>
      <div className={styles.container}>
        <div className={styles.overlay}>
          <Button variant="play" size="icon-lg" shape="circle">
             <Icon name="play_arrow" className={styles.playIcon} filled />
          </Button>
        </div>

        <div className={styles.controlsOverlay}>
           <VideoControls />
        </div>
      </div>
    </>
  );
}
