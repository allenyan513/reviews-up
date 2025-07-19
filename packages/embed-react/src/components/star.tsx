import { cn } from '../lib/utils';
import React from 'react';

export function Star(props: {
  onClick?: () => void;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { onClick, isActive = false, size = 'md' } = props;
  return (
    <svg
      onClick={onClick}
      className={cn(
        'cursor-pointer',
        size === 'sm'
          ? 'w-4 h-4'
          : size === 'md'
            ? 'w-6 h-6'
            : size === 'lg'
              ? 'w-16 h-16'
              : 'w-6 h-6',
        isActive ? 'text-yellow-400' : 'text-gray-300',
      )}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
    </svg>
  );
}
