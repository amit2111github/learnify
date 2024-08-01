import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { BadgeIcon } from '@/components/BadgeIcon';
import ChapterTitleForm from './_components/ChapterTitleForm';
import ChapterDescriptionForm from './_components/ChapterDescriptionForm';
import ChapterAccessForm from './_components/ChapterAccessForm';
import ChapterVideoForm from './_components/ChapterVideoForm';
import Banner from '@/components/Banner';
import ChapterActions from './_components/ChapterActions';

export default async function ChapterDetailPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  const chapter = await db.chapter.findUnique({
    where: { id: params.chapterId, courseId: params.courseId },
    include: { muxData: true },
  });
  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const comletionText = `${completedFields}/${totalFields}`;

  const isCompleted = requiredFields.every(Boolean);

  const percentage = (completedFields / totalFields) * 100;

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant='warning'
          label='Chapter is not published. It will not be visible to students.'
        />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className='flex items-center text-sm hover:opacity-75 transition mb-6'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to course
            </Link>

            <div className=' flex items-center justify-between w-full  '>
              <div className='flex flex-col gap-y-2'>
                <h1 className=' text-2xl font-medium'>Chapter Creation</h1>
                <Progress value={percentage} className='w-96' />
                <span className='text-sm text-slate-700'>
                  Complete all the fields {comletionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isCompleted}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        {/* Chapter Form */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-center gap-x-2'>
                <BadgeIcon icon={LayoutDashboard} variant='success' size='sm' />
                <h2 className='text-xl'>Customize your course</h2>
              </div>
              {/* Chapter title Form */}
              <ChapterTitleForm
                initialData={chapter}
                chapterId={params.chapterId}
                courseId={params.courseId}
              />

              <ChapterDescriptionForm
                initialData={chapter}
                chapterId={params.chapterId}
                courseId={params.courseId}
              />
            </div>

            <div>
              <div className='flex items-center gap-x-2'>
                <BadgeIcon icon={Eye} variant='success' size='sm' />
                <h2 className='text-xl'>Access Setting</h2>
              </div>
              {/* Chapter title Form */}

              <ChapterAccessForm
                initialData={chapter}
                chapterId={params.chapterId}
                courseId={params.courseId}
              />
            </div>
          </div>

          <div>
            <div className='flex items-center gap-x-2'>
              <BadgeIcon icon={Video} variant='success' size='sm' />
              <h2 className='text-xl'>Add a video</h2>
            </div>
            {/* Chapter title Form */}
            <ChapterVideoForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
