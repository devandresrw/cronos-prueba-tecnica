"use client";
import styles from '@/components/site/root/forms-auth/css/FormSignUp.module.css';
import FormStament from '@/components/site/root/forms-auth/ui/FormStament';
import Label from '@/components/site/root/forms-auth/ui/Label';
import Input from '@/components/site/root/forms-auth/ui/Input';
import Checkbox from '@/components/site/root/forms-auth/ui/Checkbox';
import Button from '@/components/site/root/forms-auth/ui/Button';
import ToggleForm from '@/components/site/root/forms-auth/ui/ToggleForm';
import { useFormSignUp } from '@/hooks/auths/useFormSignUp';

export default function FormSignUp() {
  const { register, onSubmit, formState: { errors, isSubmitting } } = useFormSignUp();

  return (
    <div className={styles.container}>
      <div className="" style={{ width: '100%' }}>
        <FormStament
          title="Crea tu cuenta"
          subtitle="Complete los detalles para comenzar."
        />

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <Label htmlFor="fullname">Nombre completo</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="Juan Pérez"
                icon="person"
                {...register('fullname')}
                error={errors.fullname?.message}
              />
            </div>
            <div className={styles.inputGroup}>
              <Label htmlFor="email_signup">Correo:</Label>
              <Input
                id="email_signup"
                type="email"
                placeholder="correo@ejemplo.com"
                icon="alternate_email"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <Label htmlFor="password_signup">Contraseña</Label>
            <Input
              id="password_signup"
              type="password"
              placeholder="••••••••"
              icon="lock"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
          <Checkbox
            id="terms"
            label={<span>Acepto los <a href="#" className={styles.termsLink}>Términos de Servicio</a></span>}
            {...register('terms')}
          />
          {errors.terms && (
            <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem', display: 'block' }}>
              {errors.terms.message}
            </span>
          )}

          <Button type="submit" disabled={isSubmitting}>
             Comenzar ahora
          </Button>
        </form>

        <ToggleForm />
      </div>
    </div>
  );
}