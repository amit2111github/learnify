'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  price: z.number(),
  image: z.string(),
});

export default function CreateCoursePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      image: '',
    },
  });

  const router = useRouter();
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', values);
      toast.success('Course created successfully');
      router.push(`/teacher/courses/${response.data.id}`);
    } catch (error) {
      toast.error('An error occurred while creating the course. Please try again.');
    }
  };

  return (
    <div className='max-w-5xl mx-auto flex flex-col md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl'>Name your Course</h1>
      </div>
      <p className='text-sm text-slate-600'>
        What would you like to name your course? Dont&apos;t worry, you can
        change it later.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-8'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder='e.g "Introduction to React"'
                    className='md:w-1/2'
                  />
                </FormControl>
                <FormDescription>
                  What will students learn in this course?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center gap-x-2'>
            <Link href='/'>
              <Button type='button' variant='ghost'>
                Cancel
              </Button>
            </Link>
            <Button type='submit' disabled={!isValid || isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
