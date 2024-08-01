'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

// Makde modalConfig in interface optional
interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  modalConfig?: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  };
}

export function ConfirmModal({
  children,
  onConfirm,
  modalConfig = {},
}: ConfirmModalProps) {
  const {
    title = 'Are you absolutely sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  } = modalConfig;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
