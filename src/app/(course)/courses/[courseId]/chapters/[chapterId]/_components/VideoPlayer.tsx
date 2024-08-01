'use client';

import MuxPlayer from '@mux/mux-player-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  title: string;
  completeOnEnd: boolean;
}

export default function VideoPlayer({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  title,
  completeOnEnd,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  console.log('next chapter id: ', nextChapterId);

  const onEnded = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          { isCompleted: true }
        );

        console.log('After updating ');

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success('Progress updated successfully');
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Something went wrong while updating progress');
    }
  };

  return (
    <div className='relative aspect-video'>
      {!isReady && !isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
          <Loader2 className='h-8 w-8 text-secondary animate-spin' />
        </div>
      )}

      {isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
          <Lock className='h-8 w-8' />
          <p className='text-sm'>This chapter is locked</p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          playbackId={playbackId}
          title={title}
          className={cn('h-full', !isReady && 'hidden')}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnded}
          autoPlay
        />
      )}
    </div>
  );
}
