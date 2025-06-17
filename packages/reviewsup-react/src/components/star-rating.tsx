import { clsx } from 'clsx';
import React from 'react';

export default function StarRating(props: {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={`flex space-x-1 ${props.className || ''}`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={clsx(
            'cursor-pointer',
            props.size === 'sm'
              ? 'w-4 h-4'
              : props.size === 'md'
                ? 'w-6 h-6'
                : props.size === 'lg'
                  ? 'w-16 h-16'
                  : 'w-6 h-6',
            props.value > i ? 'text-yellow-400' : 'text-gray-300',
          )}
          // className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
