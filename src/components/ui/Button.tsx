'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ArrowIcon } from './Icons';

type Variant = 'primary' | 'ghost' | 'outline' | 'text';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
};

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export type ButtonProps = AsButton | AsLink;

const base =
  'group relative inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold rounded-sm overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed select-none';

const sizeMap: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs tracking-widest small-caps',
  md: 'h-11 px-6 text-xs tracking-widest small-caps',
  lg: 'h-14 px-8 text-sm tracking-widest small-caps',
};

const variantMap: Record<Variant, string> = {
  primary:
    'bg-ink text-paper hover:bg-night focus-visible:ring-offset-paper',
  ghost:
    'bg-transparent text-ink hover:bg-cream focus-visible:ring-offset-paper',
  outline:
    'bg-transparent border border-ink/20 text-ink hover:border-ink hover:bg-ink/5 focus-visible:ring-offset-paper',
  text: 'bg-transparent text-ink hover:text-clay p-0 h-auto min-h-0 focus-visible:ring-offset-paper',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref,
) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    iconLeft,
    iconRight,
    fullWidth,
    loading = false,
    ...rest
  } = props;

  const classes = cn(
    base,
    sizeMap[size],
    variantMap[variant],
    fullWidth && 'w-full',
    className,
  );

  const spinner = (
    <span
      className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent shrink-0 animate-spin"
      aria-hidden
    />
  );

  if ((props as AsLink).href !== undefined) {
    const { href, target, rel, onClick } = props as AsLink;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={classes}
        aria-disabled={loading || undefined}
      >
        {variant === 'primary' && (
          <span className="absolute inset-0 -z-10 bg-paper origin-left scale-x-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
        )}
        {loading ? spinner : iconLeft ? <span className="shrink-0">{iconLeft}</span> : null}
        <span
          className={cn(
            variant === 'primary' &&
              'transition-colors duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-ink',
          )}
        >
          {children}
        </span>
        {!loading && iconRight && (
          <span className="shrink-0 transition-transform duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-[-2px] group-hover:translate-x-0">
            {iconRight}
          </span>
        )}
      </Link>
    );
  }

  const btnRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  const disabled = loading || btnRest.disabled;

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled}
      aria-busy={loading || undefined}
      {...btnRest}
    >
      {variant === 'primary' && (
        <span
          className="absolute inset-0 -z-10 bg-paper origin-left scale-x-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
          aria-hidden
        />
      )}
      {loading ? spinner : iconLeft ? <span className="shrink-0">{iconLeft}</span> : null}
      <span
        className={cn(
          variant === 'primary' &&
            'transition-colors duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-ink',
        )}
      >
        {children}
      </span>
      {!loading && iconRight && (
        <span className="shrink-0 transition-transform duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-[-2px] group-hover:translate-x-0">
          {iconRight}
        </span>
      )}
    </button>
  );
});
