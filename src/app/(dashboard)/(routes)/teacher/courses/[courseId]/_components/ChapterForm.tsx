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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter, Course } from '@prisma/client';
import axios from 'axios';
import { Loader2, Pencil, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import ChapterList from './ChapterList';

interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export default function ChapterForm({
  initialData,
  courseId,
}: ChapterFormProps) {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });
  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );
      toast.success('Chapter created successfully');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while creating the chapter. Please try again.'
      );
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success('Chapters reordered successfully');
      router.refresh();
    } catch (error) {
      toast.error(
        'An error occurred while reordering the chapters. Please try again.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
          <Loader2 className='h-6 w-6 text-indigo-700 animate-spin' />
        </div>
      )}
      <div className='font-medium flex items-center justify-between'>
        Course chapters
        <Button
          onClick={toggleCreating}
          variant='ghost'
          className='focus-visible:ring-slate-400 border-0'
        >
          {isCreating && <>Cancel</>}
          {!isCreating && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
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
                      {...field}
                      disabled={isSubmitting}
                      placeholder='e.g. "What is React?"'
                      className='focus-visible:ring-slate-400'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={!isValid || isSubmitting}
              variant='outline'
              className='focus-visible:ring-slate-400 border-0'
            >
              Create
            </Button>
          </form>
        </Form>
      )}

      {/* Editing Chapter */}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.chapters.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.chapters.length && 'No chapters'}
          <ChapterList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}

      {!isCreating && (
        <p className='text-xs text-muted-foreground mt-4'>
          Drag and drop the chapter to reorder
        </p>
      )}
    </div>
  );
}
