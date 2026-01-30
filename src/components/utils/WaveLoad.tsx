import styles from '@/components/site/forum/css/WrapperForo.module.css';

export const WaveLoad = () => {
  return (
   <div className="">
    {/* Background Wave */}
       <svg className={styles.waveBg} viewBox="0 0 1440 1000" xmlns="http://www.w3.org/2000/svg">
          <path className={styles.wavePath1} d="M0,200 C300,100 600,300 900,200 C1200,100 1500,200 1500,200 L1500,1000 L0,1000 Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
          <path className={styles.wavePath2} d="M0,300 C400,200 700,400 1000,300 C1300,200 1600,300 1600,300" fill="none" stroke="currentColor" strokeWidth="1"></path>
       </svg>
   </div>
  );
}