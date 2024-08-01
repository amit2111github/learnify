'use client';

import { useConfettiStore } from '@/hooks/use-confetti-store';
import Confetti from 'react-confetti';

export const ConfettiProvider = () => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) return null;

  return (
    <Confetti
      className='pointer-events-none z-[100]'
      numberOfPieces={2000}
      recycle={false}
      width={window.innerWidth}
      height={window.innerHeight}
      onConfettiComplete={confetti.onClose}
    />
  );
};
