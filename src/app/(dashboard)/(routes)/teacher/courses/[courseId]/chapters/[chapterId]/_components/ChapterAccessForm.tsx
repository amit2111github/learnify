'use client';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter } from '@prisma/client';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export default function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData?.isFree,
    },
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
        'An error occurred while updating the chapter description. Please try again.'
      );
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter access settings
        <Button
          onClick={toggleEditing}
          variant='ghost'
          className='focus-visible:ring-slate-400 border-0'
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.isFree && 'text-slate-500 italic'
          )}
        >
          {initialData.isFree ? (
            <>This chapter is free for everyone</>
          ) : (
            <>This chapter is not free for everyone.</>
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='isFree'
              render={({ field }) => (
                <FormItem className='flex flex-grow items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className='space-y-1 leading-none'>
                    <FormDescription>
                      Make this chapter free for everyone. This will allow
                      anyone to access this chapter without any payment.
                    </FormDescription>
                  </div>
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
