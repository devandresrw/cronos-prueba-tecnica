'use client';

import Button from '@/components/site/forum/ui/Button';
import styles from '@/components/site/forum/css/CommentForm.module.css';
import Avatar from '@/components/site/forum/ui/Avatar';
import { CommentFormProps } from '@/types/forum.ui.types';
import { useCommentForm } from '@/hooks/forum/useCommentForm';
import ErrorSpan from '@/components/site/root/forms-auth/ui/ErrorSpan';

export default function CommentForm({
  onSubmit,
  onCancel,
  isPending = false,
  currentUser,
  placeholder = "Únase a la discusión...",
  submitLabel = "Publicar comentario",
  isReplying = false
}: CommentFormProps) {
  
  const { 
    register, 
    handleFormSubmit, 
    handleCancel,
    errors, 
    isValid 
  } = useCommentForm({ onSubmit, onCancel });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.avatarWrapper}>
          <Avatar src={currentUser.avatar} alt={currentUser.name} size="lg" shape="rounded" />
        </div>

        <div className={styles.inputArea}>
          <div className={styles.userInfo}>
             <span className={styles.userName}>{currentUser.name}</span>
             <span className={styles.userRole}>
               {isReplying ? 'Respondiendo...' : (currentUser.role || 'Publicar como experto')}
             </span>
          </div>

          <form onSubmit={handleFormSubmit}>
            <textarea
              className={styles.textarea}
              placeholder={placeholder}
              disabled={isPending}
              {...register('content')}
            ></textarea>
            
            <ErrorSpan error={errors.content?.message} />

            <div className={styles.footer}>
               <Button 
                  type="submit"
                  variant="primary" 
                  size="md" 
                  disabled={!isValid || isPending}
               >
                  {isPending ? 'Publicando...' : submitLabel}
               </Button>
               {onCancel && (
                 <Button 
                    type="button"
                    variant="ghost" 
                    size="md" 
                    onClick={handleCancel}
                    disabled={isPending}
                 >
                    Cancelar
                 </Button>
               )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}