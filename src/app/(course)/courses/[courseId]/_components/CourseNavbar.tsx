import NavbarRoutes from '@/components/NavbarRoutes';
import { Chapter, Course, UserProgress } from '@prisma/client';
import CourseMobileSidebar from './CourseMobileSidebar';

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number;
}

export default function CourseNavbar({ course, progress }: CourseNavbarProps) {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm '>
      <CourseMobileSidebar course={course} progress={progress} />
      <NavbarRoutes />
    </div>
  );
}
