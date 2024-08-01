import { auth } from '@clerk/nextjs/server';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import CourseSidebarItem from './CourseSidebarItem';
import CourseProgress from '@/components/CourseProgress';

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number;
}

export default async function CourseSidebar({
  course,
  progress,
}: CourseSidebarProps) {
  const { userId } = auth();
  if (!userId) return redirect('/');

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='p-8 flex flex-col border-b'>
        <h1 className='font-semibold'>{course.title}</h1>
        {purchase && (
          <div className='mt-10'>
            <CourseProgress variant='success' value={progress} />
          </div>
        )}
      </div>

      <div className='flex flex-col w-full'>
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
          />
        ))}
      </div>
    </div>
  );
}
