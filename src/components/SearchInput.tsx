'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';

export default function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedSearch,
          categoryId: currentCategoryId,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedSearch, currentCategoryId, pathname, router]);

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 h-4 w-4' />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
        placeholder='Search for courses'
      />
    </div>
  );
}
