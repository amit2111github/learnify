import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function CoursesPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  // Get all the courses for the user in the order of creation descending
  const courses = await db.course.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  console.log(courses);

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
