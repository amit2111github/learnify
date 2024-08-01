import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

const iconVariant = cva('', {
  variants: {
    variant: {
      default: 'bg-indigo-700',
      success: 'bg-violet-200',
    },
    size: {
      default: 'p-2',
      sm: 'p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const backgroundVariant = cva('rounded-full flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-indigo-200',
      success: 'bg-violet-200',
    },
    iconVariant: {
      default: 'bg-indigo-700',
      success: 'bg-violet-700',
    },
    size: {
      default: 'p-2',
      sm: 'p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type IconVariantProps = VariantProps<typeof iconVariant>;
type BackgroundVariantProps = VariantProps<typeof backgroundVariant>;

interface BadgeIconProps extends IconVariantProps, BackgroundVariantProps {
  icon: LucideIcon;
}

export const BadgeIcon = ({ icon: Icon, variant, size }: BadgeIconProps) => {
  return (
    <div className={cn(backgroundVariant({ variant, size }))}>
      <Icon className={cn(iconVariant({ variant, size }))} />
    </div>
  );
};
