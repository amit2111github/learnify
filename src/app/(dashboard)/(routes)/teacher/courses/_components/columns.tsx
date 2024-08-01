'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      console.log('row', row);
      const { price } = row.original;
      const parsedPrice = parseFloat(String(price || 0));
      const formattedPrice = formatPrice(parsedPrice);
      return <div>{formattedPrice}</div>;
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Published
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;
      return (
        <Badge
          className={cn(
            'bg-slate-500',
            isPublished && 'bg-indigo-500 bg-primary'
          )}
        >
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div>
          <Link href={`/teacher/courses/${id}`}>
            <Pencil className='h-4 w-4 mr-2 text-primary-500' />
          </Link>
        </div>
      );
    },
  },
];
