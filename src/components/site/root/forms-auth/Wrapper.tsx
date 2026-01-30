"use client";
import { useEffect, useState } from 'react';
import styles from '@/components/site/root/forms-auth/css/Wrapper.module.css';
import DisclaimerForm from '@/components/site/root/forms-auth/ui/DisclaimerForm';
import FormSignIn from '@/components/site/root/forms-auth/FormSignIn';
import FormSignUp from '@/components/site/root/forms-auth/FormSignUp';
import { useToggleFormsAuth } from '@/stores/toggleFormsAuth.store';

export default function Wrapper() {
  const { isSignUp } = useToggleFormsAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.columnDisclaimer}>
          <DisclaimerForm />
        </div>
        <div className={styles.columnForm}>
          {isSignUp ? <FormSignUp /> : <FormSignIn />}
        </div>
      </div>
    </div>
  );
}
