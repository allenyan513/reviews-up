'use client';
import React from 'react';
import { Star } from './star';

export function StarRating(props: {
  value: number;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
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
