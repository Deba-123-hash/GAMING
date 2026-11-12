import { z } from 'zod';

export const passwordPolicySchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(100)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.');

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required.').max(80),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters.')
      .max(24)
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username may only contain letters, numbers, _ and -.'),
    email: z.string().trim().email('Valid email is required.').max(120),
    password: passwordPolicySchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and privacy notice.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required.').max(120),
  password: z.string().min(1, 'Password is required.').max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Valid email is required.').max(120),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, 'Invalid reset token.'),
    newPassword: passwordPolicySchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(10, 'Invalid verification token.'),
});

export function sanitizeRedirectPath(nextPath) {
  if (!nextPath || typeof nextPath !== 'string') return '/profile';
  if (!nextPath.startsWith('/') || nextPath.startsWith('//')) return '/profile';
  return nextPath;
}
