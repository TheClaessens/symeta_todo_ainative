import * as React from 'react';
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { useComposition } from '@/hooks/use-composition';
import { useHasProp } from '@/hooks/use-has-prop';
import { cn } from '@/lib/utils';

const iconVariants = cva('absolute', {
  variants: {
    size: {
      default: 'size-3',
    },
    side: {
      left: 'left-2',
      right: 'right-2',
    },
  },
  defaultVariants: {
    size: 'default',
    side: 'left',
  },
});

interface BadgeIconProps
  extends React.HTMLAttributes<HTMLOrSVGElement>,
    VariantProps<typeof iconVariants> {}

const BadgeIcon = forwardRef<HTMLSlotElement, BadgeIconProps>(
  ({ className, side, ...props }, ref) => (
    <Slot
      data-icon
      ref={ref}
      className={cn(iconVariants({ side }), className)}
      {...props}
    />
  )
);
BadgeIcon.displayName = 'BadgeIcon';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/80',
        outline: 'text-foreground bg-transparent border border-primary',
      },
      left: {
        true: 'pl-6 relative',
      },
      right: {
        true: 'pr-6 relative',
      },
      clickable: {
        true: 'cursor-pointer',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      clickable: false,
      disabled: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onClick?: () => void;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

interface BadgeComposition {
  Icon: typeof BadgeIcon;
}

const Root = forwardRef<
  ComponentRef<typeof Badge>,
  ComponentPropsWithoutRef<typeof Badge>
>(
  (
    { children: _children, className, variant, disabled, onClick, ...props },
    ref
  ) => {
    const [children, icons] = useComposition(_children, BadgeIcon.displayName);
    const hasLeftIcon = useHasProp<BadgeIconProps>(icons ?? [], 'side', 'left');
    const hasRightIcon = useHasProp<BadgeIconProps>(
      icons ?? [],
      'side',
      'right'
    );

    return (
      <Badge
        ref={ref}
        className={cn(
          badgeVariants({
            left: hasLeftIcon,
            right: hasRightIcon,
            clickable: !!onClick,
            variant,
            disabled,
            className,
          })
        )}
        onClick={onClick}
        {...props}>
        {icons}
        {children}
      </Badge>
    );
  }
);
Root.displayName = 'Badge';

const RootWithComposition: typeof Root & BadgeComposition = Object.assign(
  Root,
  {
    Icon: BadgeIcon,
  }
);

export { RootWithComposition as Badge };
