'use client';

import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import axios from 'axios';
import { Check, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CourseProgressButtonProps {
  courseId: string;
  chapterId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export default function CourseProgressButton({
  courseId,
  chapterId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const Icon = isCompleted ? XCircle : CheckCircle;

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success('Progress updated successfully');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error('Something went wrong while updating progress');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className='w-full md:w-auto'
      type='button'
      onClick={onClick}
      variant={isCompleted ? 'outline' : 'success'}
    >
      {isCompleted ? 'View Chapter' : 'Mark as Complete'}
      <Icon className='h-4 w-4 ml-2' />
    </Button>
  );
}
