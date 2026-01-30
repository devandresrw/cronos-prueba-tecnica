import { z } from 'zod';

export const commentSchema = z.object({
  content: z.string()
    .min(3, { message: 'El comentario debe tener al menos 3 caracteres' })
    .max(500, { message: 'El comentario no puede exceder los 500 caracteres' }),
});

export type CommentSchema = z.infer<typeof commentSchema>;
