import { getCourses } from '@/actions/get-courses';
import SearchInput from '@/components/SearchInput';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Categories from './_components/Categories';
import CoursesList from './_components/CoursesList';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) return redirect('/');

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const courses = await getCourses({ ...searchParams, userId });

  return (
    <>
      <div className='px-6 pt-6 block md:hidden md:mb-0 '>
        <SearchInput />
      </div>
      <div className='p-6 space-y-4'>
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
