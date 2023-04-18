import { AppError } from '@superlight-labs/mpc-common';
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
  | Progress
  | Empty;

type Progress = {
  level: 'progress';
  step: number;
  total: number;
  message: string;
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
