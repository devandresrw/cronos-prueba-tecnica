'use client';

import { useUIStore } from '@/stores/ui.store';
import { useEffect } from 'react';

// Estilos inline básicos para la demo, mover a CSS Module idealmente
const notificationStyles = {
  position: 'fixed' as const,
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  borderRadius: '8px',
  color: '#fff',
  zIndex: 9999,
  transition: 'opacity 0.3s ease',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const successStyle = { ...notificationStyles, backgroundColor: '#10B981' }; // Verde
const errorStyle = { ...notificationStyles, backgroundColor: '#EF4444' }; // Rojo

export default function Notifications() {
  const { notification, clearNotification } = useUIStore();

  useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3000); // Auto-cierra en 3 segundos
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification.type || !notification.message) return null;

  return (
    <div style={notification.type === 'success' ? successStyle : errorStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {notification.type === 'success' ? (
           // Icono Success Simple (SVG)
           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
           </svg>
        ) : (
           // Icono Error Simple (SVG)
           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        )}
        <span>{notification.message}</span>
      </div>
    </div>
  );
}
