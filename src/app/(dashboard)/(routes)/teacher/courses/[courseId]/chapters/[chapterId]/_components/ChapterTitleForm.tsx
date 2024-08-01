'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export default function ChapterTitleForm({
  initialData,
  courseId,
  chapterId,
}: ChapterTitleFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

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
        Chapter title
        <Button
          onClick={toggleEditing}
          variant='ghost'
          className='focus-visible:ring-slate-400 border-0'
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit title
            </>
          )}
        </Button>
      </div>

      {!isEditing && <p className='text-sm mt-2'>{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      {...field}
                      placeholder='e.g. "Introduction to React"'
                      className='focus-visible:ring-slate-400 border-0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button
                type='submit'
                disabled={!isValid || isSubmitting}
                variant='outline'
                className='focus-visible:ring-slate-400 border-0'
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
