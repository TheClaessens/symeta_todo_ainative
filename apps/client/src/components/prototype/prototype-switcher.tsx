import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PrototypeSwitcherProps {
  variants: ReadonlyArray<{ id: string; name: string }>;
  current: string;
  onSelect: (id: string) => void;
}

const PrototypeSwitcher = ({
  variants,
  current,
  onSelect,
}: PrototypeSwitcherProps) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      const index = variants.findIndex((variant) => variant.id === current);
      if (index < 0) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = variants[(index + step + variants.length) % variants.length];
      if (next) onSelect(next.id);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [current, onSelect, variants]);

  if (import.meta.env.PROD) return null;

  const index = variants.findIndex((variant) => variant.id === current);
  const active = variants[index] ?? variants[0];
  if (!active) return null;
  const select = (step: number) => {
    const next = variants[(index + step + variants.length) % variants.length];
    if (next) onSelect(next.id);
  };

  return (
    <div className='fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-foreground px-1 py-1 text-background shadow-lg'>
      <button
        type='button'
        className='flex size-8 items-center justify-center rounded-full hover:bg-background/15'
        aria-label='Previous variant'
        onClick={() => {
          select(-1);
        }}>
        <ChevronLeft className='size-4' />
      </button>
      <span className='min-w-40 px-2 text-center text-sm font-medium'>
        {active.id} ({active.name})
      </span>
      <button
        type='button'
        className='flex size-8 items-center justify-center rounded-full hover:bg-background/15'
        aria-label='Next variant'
        onClick={() => {
          select(1);
        }}>
        <ChevronRight className='size-4' />
      </button>
    </div>
  );
};

export default PrototypeSwitcher;
