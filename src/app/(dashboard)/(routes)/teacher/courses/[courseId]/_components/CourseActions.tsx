'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export default function CourseActions({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      console.log('Deleting course with id: ', courseId);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted successfully');
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      toast.error(
        'An error occurred while deleting the course. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);
      const updatedStaus = isPublished ? 'unpublish' : 'publish';
      await axios.patch(`/api/courses/${courseId}/${updatedStaus}`);
      toast.success(`Course ${updatedStaus} successfully`);
      if (!isPublished) {
        confetti.onOpen();
      }
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while updating the course. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2 '>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        size='sm'
        variant='outline'
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>

      <ConfirmModal
        onConfirm={onDelete}
        modalConfig={{ title: 'Are you sure you want to delete this course?' }}
      >
        <Button size='sm' variant='outline' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
}
