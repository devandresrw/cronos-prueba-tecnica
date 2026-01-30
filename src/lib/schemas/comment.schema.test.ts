import { describe, it, expect } from 'vitest';
import { commentSchema } from './comment.schema';

describe('Comment Schema Validation', () => {
  it('should validate correct input', () => {
    const validData = { content: 'Este es un comentario válido.' };
    const result = commentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if content is too short', () => {
    const invalidData = { content: 'Hi' };
    const result = commentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.issues[0].message).toBe('El comentario debe tener al menos 3 caracteres');
    }
  });

  it('should fail if content is too long', () => {
    const longText = 'a'.repeat(501);
    const invalidData = { content: longText };
    const result = commentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.issues[0].message).toBe('El comentario no puede exceder los 500 caracteres');
    }
  });
});
