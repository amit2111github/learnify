import { getChapter } from '@/actions/get-chapter';
import Banner from '@/components/Banner';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import VideoPlayer from './_components/VideoPlayer';
import CourseEnrollButton from './_components/CourseEnrollButton';
import { Separator } from '@/components/ui/separator';
import Preview from '@/components/Preview';
import { File } from 'lucide-react';
import CourseProgressButton from './_components/CourseProgressButton';

export default async function ChaptePage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();
  if (!userId) return redirect('/');

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    progress,
    purchase,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!course || !chapter) return redirect('/');

  const isLocked = !chapter.isFree && !purchase;

  const completeOnEnd = !!purchase && !progress?.isCompleted;

  return (
    <div>
      {progress?.isCompleted && (
        <Banner
          variant='success'
          label='You have already completed this chapter'
        />
      )}
      {isLocked && (
        <Banner
          variant='warning'
          label='You need to purchase the course to access this chapter'
        />
      )}

      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4'>
          <VideoPlayer
            chapterId={chapter.id}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                courseId={params.courseId}
                chapterId={chapter.id}
                nextChapterId={nextChapter?.id}
                isCompleted={progress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description!} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />
              <div className='p-4'>
                <p className='font-semibold pb-4'>List of Attachments</p>

                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target='_blank'
                    // rel='noreferrer'
                    key={attachment.id}
                    className='flex items-center p-3 w-full bg-indigo-200 border text-indigo-700 rounded-md hover:underline'
                  >
                    <File />
                    <p className='line-clamp-1'>{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
