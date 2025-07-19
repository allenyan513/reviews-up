import { Star } from './star';
import React from 'react';

export function StarRatingServer(props: {
  value: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={`flex space-x-1 ${props.className || ''}`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} isActive={props.value > i} size={props.size} />
      ))}
    </div>
  );
}
