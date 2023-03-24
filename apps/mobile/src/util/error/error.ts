import { AppError } from 'state/snackbar.state';

export const appError = (error: unknown, message: string): AppError => ({
  error,
  message,
  level: 'error',
});
