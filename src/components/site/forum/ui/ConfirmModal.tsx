'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/components/site/forum/ui/css/ConfirmModal.module.css';
import Button from '@/components/site/forum/ui/Button';
import { ConfirmModalProps } from '@/types/forum.ui.types'

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = false
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Bloquear scroll al abrir
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const content = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary" // Podríamos agregar variant="destructive" si existiera en Button
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={isDestructive ? { backgroundColor: '#ef4444', color: 'white' } : {}}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
