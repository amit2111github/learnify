'use client';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';

import { Course } from '@prisma/client';
import axios from 'axios';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, 'Image is required'),
});

export default function ImageForm({ initialData, courseId }: ImageFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while updating the course. Please try again.'
      );
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course image
        <Button
          onClick={toggleEditing}
          variant='ghost'
          className='focus-visible:ring-slate-400 border-0'
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {initialData.imageUrl ? (
                <>
                  <Pencil className='h-4 w-4 mr-2' />
                  Edit image
                </>
              ) : (
                <>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  Add an image
                </>
              )}
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image
              alt='Course image'
              src={initialData.imageUrl}
              fill
              className='object-cover rounded-md'
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseImage'
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4 '>
            Recommended size: 1280x720
          </div>
        </div>
      )}
    </div>
  );
}
