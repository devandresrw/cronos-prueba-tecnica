import { ButtonHTMLAttributes, HTMLAttributes, BaseSyntheticEvent } from 'react'

export interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  isPending?: boolean;
  currentUser: {
    name: string;
    avatar?: string | null;
    role?: string;
  };
  placeholder?: string;
  submitLabel?: string;
  isReplying?: boolean;
}

export interface ChannelInfoProps {
  name: string;
  subscribers: string;
  avatarSrc: string;
}


export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  borderRadius?: string;
}

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'glass' | 'play';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-lg';
  shape?: 'rounded' | 'pill' | 'circle';
  children: React.ReactNode;
}

export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded';
  className?: string;
}

export interface CommentUser {
  name: string;
  avatar: string;
}

export interface CommentUIModel {
  id: string;
  authorId: string;
  user: CommentUser;
  time: string;
  message: string;
  likes: number;
  replies: CommentUIModel[];
  parentId: string | null;
  isOptimistic?: boolean;
}

// Hook Types
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { CommentSchema } from '@/lib/schemas/comment.schema';

export interface UseCommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

export interface UseCommentFormReturn {
  register: UseFormRegister<CommentSchema>;
  errors: FieldErrors<CommentSchema>;
  isValid: boolean;
  handleFormSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  handleCancel: () => void;
}
