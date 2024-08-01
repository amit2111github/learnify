'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { IconType } from 'react-icons/lib';

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
}

export default function CategoryItem({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get('title');
  const currentCategoryId = searchParams.get('categoryId');

  const isSelected = currentCategoryId === value;

  console.log('isSelected', isSelected);
  console.log('currentCategoryId', currentCategoryId);
  console.log('value', value);
  

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: isSelected ? null : value,
          title: currentTitle,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <button
      className={cn(
        'py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-indigo-700 transition',
        isSelected && 'border-indigo-700 bg-indigo-200/20 text-indigo-800'
      )}
      type='button'
      onClick={onClick}
    >
      {Icon && <Icon size={20} />}
      <div className='truncate'>{label}</div>
    </button>
  );
}
