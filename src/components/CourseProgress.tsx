import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

interface CourseProgressProps {
  variant: 'success' | 'default';
  value: number;
  size?: 'sm' | 'default';
}

const colorByVariant = {
  success: 'bg-emerald-700',
  default: 'bg-indigo-700',
};

const sizeByVariant = {
  sm: 'text-xs',
  default: 'text-sm',
};

export default function CourseProgress({
  variant,
  value,
  size,
}: CourseProgressProps) {
  return (
    <div>
      <Progress value={value} className='h-2' variant={variant} />
      <p
        className={cn(
          'font-medium mt-2 text-indigo-700',
          // colorByVariant[variant || 'default'],
          sizeByVariant[size || 'default']
        )}
      >
        {Math.round(value)}% Completed
      </p>
    </div>
  );
}
