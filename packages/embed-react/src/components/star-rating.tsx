'use client';
import { cn } from '../lib/utils';
import React from 'react';
import { Star } from './star';

export function StarRating(props: {
  value: number;
  onChange?: (val: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={`flex space-x-1 ${props.className || ''}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          onClick={() => {
            if (props.onChange) {
              props.onChange(i + 1);
            }
          }}
          isActive={props.value > i}
          size={props.size}
        />
      ))}
    </div>
  );
}
