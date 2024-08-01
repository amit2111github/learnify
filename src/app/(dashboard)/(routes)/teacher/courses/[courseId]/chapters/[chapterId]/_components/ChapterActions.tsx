'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export default function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted successfully');
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error(
        'An error occurred while deleting the chapter. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);
      const updatedStaus = isPublished ? 'unpublish' : 'publish';
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/${updatedStaus}`
      );
      toast.success(`Chapter ${updatedStaus} successfully`);
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while updating the chapter. Please try again.'
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
        modalConfig={{ title: 'Are you sure you want to delete this chapter?' }}
      >
        <Button size='sm' variant='outline' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
}
