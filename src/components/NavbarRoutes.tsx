'use client';

import dynamic from 'next/dynamic';
const UserButton = dynamic(
  () => import('@clerk/nextjs').then((module) => module.UserButton),
  {
    ssr: false,
  }
);
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import SearchInput from './SearchInput';
import { useAuth } from '@clerk/nextjs';
import { isTeacher } from '@/lib/teacher';

const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.includes('/courses');

  const isSearchPage = pathname?.startsWith('/search');

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href='/'>
            <Button size='sm' variant='ghost'>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href='/teacher/courses'>
            <Button size='sm' variant='ghost'>
              Teacher Mode
            </Button>
          </Link>
        ) : null}

        <UserButton />
      </div>
    </>
  );
};

export default NavbarRoutes;
