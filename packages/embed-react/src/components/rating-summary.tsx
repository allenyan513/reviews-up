'use client';
import React from 'react';
import { StarRatingServer } from './star-rating.server';

export function RatingSummary(props: { ratings: number[] }) {
  const { ratings = [] } = props;
  const averageRating =
    ratings.reduce((acc, rating) => acc + rating, 0) / (ratings.length || 1);
  const averageRatingFixed = averageRating.toFixed(1);
  const totalReviews = ratings.length;
  return (
    <div
      // className="flex flex-col items-center justify-center gap-1"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
      }}
    >
      <div
        // className="flex items-center gap-2"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          // className="text-2xl font-bold text-gray-900"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827', // Tailwind's text-gray-900
          }}
        >
          {averageRatingFixed}
        </span>
        <span
          // className="text-sm text-gray-600"
          style={{
            fontSize: '0.875rem',
            color: '#6B7280', // Tailwind's text-gray-600
          }}
        >
          / 5
        </span>
        <span
          style={{
            fontSize: '0.875rem',
            color: '#6B7280', // Tailwind's text-gray-600
          }}
        >
          ({totalReviews} reviews)
        </span>
      </div>
      <StarRatingServer value={averageRating} size={'md'} />
    </div>
  );
}
