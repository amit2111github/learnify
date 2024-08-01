import { getDashboardCourses } from '@/actions/get-dashboard-courses';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CoursesList from '../search/_components/CoursesList';
import { CheckCircle, Clock } from 'lucide-react';
import InforCard from './_components/InforCard';

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) return redirect('/');

  const { completedCourses, courseInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InforCard
          icon={Clock}
          label='In Progress'
          numberOfItems={courseInProgress.length}
        />
        <InforCard
          icon={CheckCircle}
          label='Completed'
          variant='success'
          numberOfItems={courseInProgress.length}
        />
      </div>

      <CoursesList items={[...courseInProgress, ...completedCourses]} />
    </div>
  );
}
