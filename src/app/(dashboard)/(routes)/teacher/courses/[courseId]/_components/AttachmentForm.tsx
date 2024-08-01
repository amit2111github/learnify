'use client';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';

import { Attachment, Course } from '@prisma/client';
import axios from 'axios';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, 'Image is required'),
});

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );
      toast.success('Course updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while updating the course. Please try again.'
      );
    }
  };

  const deleteAttachment = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await axios.delete(
        `/api/courses/${courseId}/attachments/${id}`
      );
      toast.success('Attachment deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while deleting the attachment. Please try again.'
      );
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button
          onClick={toggleEditing}
          variant='ghost'
          className='focus-visible:ring-slate-400 border-0'
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {!initialData.attachments.length ? (
            <p className='text-sm text-muted-foreground italic'>
              No attachments found.
            </p>
          ) : (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='flex items-center p-3 w-full bg-indigo-100 border-indigo-200 text-indigo-700 rounded-md'
                >
                  <File className='h-4 w-4 mr-2 flex-shrink-0' />
                  <p className='text-xs line-clamp-1'>{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className='h-4 w-4 animate-spin' />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className='ml-auto hover:opacity-75 transition'
                      onClick={() => deleteAttachment(attachment.id)}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4 '>
            Add a file to your course
          </div>
        </div>
      )}
    </div>
  );
}
