import React from 'react';
import StarRating from './star-rating';

export function RatingSummary(props: { ratings: number[] }) {
  const { ratings = [] } = props;
  const averageRating =
    ratings.reduce((acc, rating) => acc + rating, 0) / (ratings.length || 1);
  const averageRatingFixed = averageRating.toFixed(1);
  const totalReviews = ratings.length;
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {averageRatingFixed}
        </span>
        <span className="text-sm text-gray-600">/ 5</span>
        <span className="text-sm text-gray-600 cursor-pointer hover:cursor-pointer hover:underline">
          ({totalReviews} reviews)
        </span>
      </div>
      <StarRating value={averageRating} onChange={null} />
    </div>
  );
}
