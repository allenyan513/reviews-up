import { Star } from './star';
import React from 'react';

export function StarRatingServer(props: {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} isActive={props.value > i} size={props.size} />
      ))}
    </div>
  );
}
