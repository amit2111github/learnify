import { BadgeIcon } from '@/components/BadgeIcon';
import { LucideIcon } from 'lucide-react';

interface InforCardProps {
  label: string;
  numberOfItems: number;
  icon: LucideIcon;
  variant?: 'success' | 'default';
}

export default function InforCard({
  label,
  numberOfItems,
  variant = 'success',
  icon: Icon,
}: InforCardProps) {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
      <BadgeIcon icon={Icon} variant={variant} size='sm' />
      <div>
        <p className='font-medium'>{label}</p>
        <p className='text-gray-500 text-sm'>
          {numberOfItems} {numberOfItems > 1 ? 'Courses' : 'Course'}
        </p>
      </div>
    </div>
  );
}
