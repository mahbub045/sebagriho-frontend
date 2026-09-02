'use client';

import { Moon, SunMedium } from 'lucide-react';
import * as React from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <button
      type='button'
      aria-label='Toggle theme'
      onClick={() => setIsDark((prev) => !prev)}
      className='inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent'
    >
      {isDark ? (
        <SunMedium className='h-4 w-4' />
      ) : (
        <Moon className='h-4 w-4' />
      )}
    </button>
  );
}
