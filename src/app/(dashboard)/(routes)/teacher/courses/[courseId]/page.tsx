import { BadgeIcon } from '@/components/BadgeIcon';
import { Progress } from '@/components/ui/progress';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListCheck,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import CategoryForm from './_components/CategoryForm';
import PriceForm from './_components/PriceForm';
import AttachmentForm from './_components/AttachmentForm';
import ChapterForm from './_components/ChapterForm';
import Banner from '@/components/Banner';
import CourseActions from './_components/CourseActions';

export default async function CoursesDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  if (!course) {
    return redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const comletionText = `${completedFields}/${totalFields}`;

  const isCompleted = requiredFields.every(Boolean);

  // calculate percentage
  const percentage = (completedFields / totalFields) * 100;

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant='warning'
          label='Course is not published. It will not be visible to students.'
        />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='text-2xl font-medium'>Course Setup</h1>
            <Progress value={percentage} className='w-96' />
            <span className='text-sm text-slate-700'>
              Complete all fields {comletionText}
            </span>
          </div>
          <CourseActions
            disabled={!isCompleted}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center gap-x-2'>
              <BadgeIcon icon={LayoutDashboard} variant='success' size='sm' />
              <h2 className='text-xl'>Customize your course</h2>
            </div>
            {/* Form Starts */}
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            {/* Form Ends */}
          </div>
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <BadgeIcon icon={ListCheck} variant='success' size='sm' />
                <h2 className='text-xl'>Course chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>
                <BadgeIcon
                  icon={CircleDollarSign}
                  variant='success'
                  size='sm'
                />
                <h2 className='text-xl'>Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>

            <div>
              <div className='flex items-center gap-x-2'>
                <BadgeIcon icon={File} variant='success' size='sm' />
                <h2 className='text-xl'>Resourses & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
