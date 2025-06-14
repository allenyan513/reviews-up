import { cn } from '@/lib/utils';
import React from 'react';

export function Logo(props: { className?: string }) {
  return (
    <img
      className={cn('h-8 w-8', props.className)}
      src={'/img/logo-32.png'}
      alt="logo"
    />
  );
}
