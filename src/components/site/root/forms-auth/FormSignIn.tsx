"use client";
import styles from '@/components/site/root/forms-auth/css/FormSignIn.module.css';
import FormStament from '@/components/site/root/forms-auth/ui/FormStament';
import Label from '@/components/site/root/forms-auth/ui/Label';
import Input from '@/components/site/root/forms-auth/ui/Input';
import Checkbox from '@/components/site/root/forms-auth/ui/Checkbox';
import Button from '@/components/site/root/forms-auth/ui/Button';
import ToggleForm from '@/components/site/root/forms-auth/ui/ToggleForm';
import DisclaimerSecurity from '@/components/site/root/forms-auth/ui/DisclaimerSecurity';
import { useFormSignIn } from '@/hooks/auths/useFormSignIn';

export default function FormSignIn() {
  const { register, onSubmit, formState: { errors, isSubmitting } } = useFormSignIn();
  return (
    <div className={styles.container}>
      <div className="max-w-md w-full mx-auto" style={{ width: '100%', maxWidth: '28rem', margin: '0 auto' }}>
        <FormStament
          title="Bienvenido de nuevo"
          subtitle="Ingresa tus credenciales para acceder"
        />
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.inputGroup}>
            <Label htmlFor="email">Correo:</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              icon="mail"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.row}>
              <Label htmlFor="password" style={{marginBottom: 0}}>Contraseña</Label>
              <a href="#" className={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              icon="lock"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <Checkbox
            id="remember"
            label="Mantener sesión iniciada"
            {...register('remember')}
          />

          <Button type="submit" disabled={isSubmitting}>
            <span className={styles.buttonContent}>
              Iniciar sesión
              <span className={`material-symbols-outlined ${styles.icon}`}>arrow_forward</span>
            </span>
          </Button>
        </form>
        <ToggleForm />
        <DisclaimerSecurity />
      </div>
    </div>
  );
}
