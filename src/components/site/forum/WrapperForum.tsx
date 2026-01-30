'use client';
import styles from '@/components/site/forum/css/WrapperForo.module.css';
import VideoPlayer from '@/components/site/forum/video/VideoPlayer';
import CommentSection from '@/components/site/forum/social/CommentSection';
import variablesStyles from '@/components/site/forum/css/variables.module.css';
import { WaveLoad } from '@/components/utils/WaveLoad';
import Notifications from '@/components/utils/Notifications';
import { useUIStore } from '@/stores/ui.store';

export default function WrapperForo() {
   const { isGlobalLoading } = useUIStore();

   return (
      <div className={`${variablesStyles.theme} ${styles.pageWrapper}`}>
         {isGlobalLoading && <WaveLoad />}
         <Notifications />
         <main className={styles.main}>
            <section className={styles.videoSection}>
               <VideoPlayer />
            </section>
            <section className={styles.socialSection}>
               <CommentSection />
            </section>
         </main>
      </div>
   );
}