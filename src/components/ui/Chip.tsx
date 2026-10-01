import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  accent?: string;
  className?: string;
};

export function Chip({ children, variant = 'default', accent, className }: Props) {
  if (variant === 'accent' && accent) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-sans font-medium',
          className,
        )}
        style={{
          background: `${accent}1f`,
          color: '#1A1714',
          border: `1px solid ${accent}33`,
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: accent }}
          aria-hidden
        />
        {children}
      </span>
    );
  }
  if (variant === 'outline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-sans font-medium border border-ink/15 text-ink/80',
          className,
        )}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-sans font-medium bg-cream text-ink/80 border border-ink/5',
        className,
      )}
    >
      {children}
    </span>
  );
}
