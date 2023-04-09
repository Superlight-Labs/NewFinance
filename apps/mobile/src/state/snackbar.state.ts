import { create } from 'zustand';

type AppSnackbarState = {
  message: AppMessage;
  setMessage: (message: AppMessage) => void;
  resetMessage: () => void;
};

export type AppMessage =
  | {
      message: string;
      level: 'warning' | 'info' | 'success';
    }
  | AppError
  | Empty;

export type AppError = {
  message: string;
  error: unknown;
  level: 'error';
};

type Empty = {
  message: '';
  level: 'empty';
};

export type MessageLevel = AppMessage['level'];

export const useSnackbarState = create<AppSnackbarState>()(set => ({
  message: { message: '', level: 'empty' },
  setMessage: message => set(_ => ({ message })),
  resetMessage: () => set(_ => ({ message: { message: '', level: 'empty' } })),
}));
