import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CourseSidebar from './_components/CourseSidebar';
import CourseNavbar from './_components/CourseNavbar';

export default async function CourseLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    courseId: string;
  };
}>) {
  const { userId } = auth();
  if (!userId) return redirect('/');

  const course = await db.course.findFirst({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        include: {
          userProgress: { where: { userId } },
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) return redirect('/');

  const progress = await getProgress(params.courseId, userId);

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
        <CourseNavbar course={course} progress={progress} />
      </div>
      <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <CourseSidebar course={course} progress={progress} />
      </div>
      <main className='md:pl-80 h-full pt-[80px]'>{children}</main>
    </div>
  );
}
