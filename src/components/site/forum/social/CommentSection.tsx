// src/components/site/forum/social/CommentSection.tsx
'use client';

import CommentForm from '@/components/site/forum/social/CommentForm';
import CommentItem from '@/components/site/forum/social/CommentItem';
import Icon from '@/components/site/forum/ui/Icon';
import Skeleton from '@/components/site/forum/ui/Skeleton';
import styles from '@/components/site/forum/css/CommentSection.module.css';
import { useGetComments } from '@/hooks/forum/useGetComments';
import { useAddComment } from '@/hooks/forum/useAddComment';
import { useDeleteComment } from '@/hooks/forum/useDeleteComment';
import { useCommentTree } from '@/hooks/forum/useCommentTree';
import { useUserDocument } from '@/hooks/auths/useUserDocument';
import { useCommentInputStore } from '@/stores/commentInput.store';

export default function CommentSection({ postId = "post-demo-1" }: { postId?: string }) {
  const { data: comments, isLoading, error, refetch } = useGetComments(postId);
  const { mutate: addComment, isPending } = useAddComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);
  
  const commentTree = useCommentTree(comments);
  
  const { displayName, avatar, userId, isLoading: isUserLoading } = useUserDocument();
  const { replyingTo, setReplyingTo, clearReplyingTo } = useCommentInputStore();

  const handleSubmitComment = (content: string) => {
    addComment({ content });
  };

  const handleReplySubmit = (parentId: string, content: string) => {
    addComment({ content, parentId }, {
        onSuccess: () => {
            clearReplyingTo();
        }
    });
  };

  const currentUser = {
      name: displayName,
      avatar: avatar || null
  };

  return (
    <div className={styles.section}>
       <div className={styles.header}>
          <h2 className={styles.title}>
             <Icon name="forum" className={styles.iconPrimary} />
             Comentarios
          </h2>
          <span className={styles.count}>{comments?.length || 0} Comentarios</span>
       </div>

       {/* Mostrar skeleton mientras carga el usuario */}
       {isUserLoading ? (
         <div className={styles.skeletonItem}>
           <Skeleton width="3rem" height="3rem" borderRadius="0.5rem" />
           <div className={styles.skeletonContent}>
             <Skeleton width="100%" height="4rem" />
           </div>
         </div>
       ) : (
         <CommentForm 
            currentUser={currentUser}
            onSubmit={handleSubmitComment}
            isPending={isPending}
         />
       )}
    
       <div className={styles.list}>
          {isLoading && (
            <div className={styles.skeletonItem}>
              <Skeleton width="3rem" height="3rem" borderRadius="0.5rem" />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonHeader}>
                  <Skeleton width="8rem" height="1rem" />
                  <Skeleton width="4rem" height="0.75rem" />
                </div>
                <Skeleton width="100%" height="1rem" className={styles.skeletonLine} />
                <Skeleton width="66%" height="1rem" />
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <p>Error al cargar comentarios: {error.message}</p>
              <button 
                onClick={() => refetch()}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ef4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && commentTree.map(comment => (
            <CommentItem 
                key={comment.id}
                {...comment}
                currentUserId={userId}
                onDelete={(id) => deleteComment(id)}
                onReply={(id) => replyingTo === id ? clearReplyingTo() : setReplyingTo(id)}
                isReplying={replyingTo === comment.id}
                replyInput={
                    <CommentForm
                        currentUser={currentUser}
                        onSubmit={(content) => handleReplySubmit(comment.id, content)}
                        onCancel={clearReplyingTo}
                        isPending={isPending || isUserLoading}
                        isReplying={true}
                        placeholder="Escribe tu respuesta..."
                        submitLabel="Responder"
                    />
                }
            />
          ))}

          {!isLoading && commentTree.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              No hay comentarios aún. ¡Sé el primero en comentar!
            </div>
          )}
       </div>
    </div>
  );
}