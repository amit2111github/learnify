'use client';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';

import { Chapter, MuxData } from '@prisma/client';
import axios from 'axios';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';
import MuxPlayer from '@mux/mux-player-react';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, 'Video is required'),
});

export default function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success('Chapter updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while updating the chapter. Please try again.'
      );
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter video
        <Button
          onClick={toggleEditing}
          variant='ghost'
          className='focus-visible:ring-slate-400 border-0'
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {initialData.videoUrl ? (
                <>
                  <Pencil className='h-4 w-4 mr-2' />
                  Edit video
                </>
              ) : (
                <>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  Add a video
                </>
              )}
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <Video className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <MuxPlayer playbackId={initialData.muxData?.playbackId || ''} />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='chapterVideo'
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4 '>
            Uplaod this chapter&apos; video. Supported formats: MP4
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className='text-xs text-muted-foreground mt-2 '>
          Videos can take few minutes to process. Refresh the page if it takes
          more than a minute.
        </div>
      )}
    </div>
  );
}
