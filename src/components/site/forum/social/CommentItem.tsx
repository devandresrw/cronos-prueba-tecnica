'use client';
import { ReactNode, useState } from 'react';
import Avatar from '@/components/site/forum/ui/Avatar';
import Icon from '@/components/site/forum/ui/Icon';
import styles from '@/components/site/forum/css/CommentItem.module.css';
import { CommentUIModel } from '@/types/forum.ui.types';
import ConfirmModal from '@/components/site/forum/ui/ConfirmModal';

interface CommentItemProps extends CommentUIModel {
  onReply: (commentId: string) => void;
  isReplying: boolean;
  replyInput?: ReactNode;
  currentUserId?: string | null;
  onDelete: (commentId: string) => void;
  variant?: 'root' | 'reply';
}

export default function CommentItem({ 
  id, 
  authorId,
  user, 
  time, 
  message, 
  likes, 
  replies, 
  onReply, 
  isReplying, 
  replyInput,
  currentUserId,
  onDelete,
  variant = 'root',
  isOptimistic
}: CommentItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = currentUserId === authorId;
  const isReply = variant === 'reply';
  
  // Style for optimistic UI (pending)
  const containerStyle = isOptimistic ? { opacity: 0.6, pointerEvents: 'none' as const } : {};

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(String(id));
  };

  // Dynamic classes based on variant
  const containerClass = isReply ? styles.replyItem : styles.comment;
  const nameClass = isReply ? styles.replyName : styles.name;
  const timeClass = isReply ? styles.replyTime : styles.time;
  const messageClass = isReply ? styles.replyMessage : styles.message;
  const headerClass = isReply ? styles.replyHeader : styles.header;
  const avatarSize = isReply ? 'sm' : 'lg';

  return (
    <>
      <div className={variant === 'root' ? styles.wrapper : ''} style={containerStyle}>
         <div className={containerClass}>
            <div className={variant === 'root' ? styles.avatarWrapper : ''}>
               <Avatar src={user.avatar} alt={user.name} size={avatarSize} shape="rounded" />
            </div>

            <div className={styles.content}>
               <div className={headerClass}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <span className={nameClass}>{user.name}</span>
                     <span className={timeClass}>{time}</span>
                  </div>
                  
                  {/* Actions that appear in header for replies or specific layout */}
                  {isReply && isOwner && (
                     <button 
                        onClick={handleDeleteClick}
                        className={`${styles.deleteBtn} ${styles.deleteBtnHeader}`}
                        title="Eliminar respuesta"
                     >
                        <Icon name="delete" className={styles.deleteIconSm} />
                     </button>
                  )}
               </div>

               <p className={messageClass}>{message}</p>

               {/* Actions Footer - Usually for Root comments */}
               {!isReply && (
                  <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => onReply(id)}>
                         <Icon name="reply" className={styles.actionIcon} />
                         {isReplying ? 'Cancelar' : 'Responder'}
                      </button>
                      
                      {isOwner && (
                        <button 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                          onClick={handleDeleteClick}
                          title="Eliminar comentario"
                        >
                          <Icon name="delete" className={styles.actionIcon} />
                          Eliminar
                        </button>
                      )}
                  </div>
               )}
            </div>
         </div>

         {/* Reply Input Form */}
         {isReplying && replyInput && (
            <div style={{ marginTop: '1rem', marginLeft: isReply ? '0' : '3.5rem' }}>
               {replyInput}
            </div>
         )}

         {/* Recursive Replies */}
         {replies && replies.length > 0 && (
            <div className={styles.replies}>
               {replies.map(reply => (
                  <CommentItem
                     key={reply.id}
                     {...reply}
                     variant="reply"
                     onReply={onReply}
                     isReplying={false}
                     replyInput={null}
                     currentUserId={currentUserId}
                     onDelete={onDelete}
                  />
               ))}
            </div>
         )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar comentario?"
        message="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este comentario?"
        confirmLabel="Eliminar"
        isDestructive={true}
      />
    </>
  );
}
