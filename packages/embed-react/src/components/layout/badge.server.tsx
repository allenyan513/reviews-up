import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import React from 'react';
import { StarServer } from '../star.server';

interface BadgeProps {
  items: ReviewEntity[];
  config?: WidgetConfig;
}

export function Badge({ items, config }: BadgeProps) {
  const ratings = items.map((item) => item.rating || 0);
  const averageRating =
    ratings.reduce((acc, rating) => acc + rating, 0) / (ratings.length || 1);
  const averageRatingFixed = averageRating.toFixed(1);
  const totalReviews = ratings.length;
  return (
    <div className="inline-flex flex-row items-center justify-start gap-3 py-2 px-3 border rounded-md bg-white">
      <img
        src="https://reviewsup.io/favicon.ico"
        alt="ReviewsUp Logo"
        className="w-7 h-7"
      />
      <div className="flex flex-col items-start justify-center ">
        <p className="text-[0.5rem] uppercase">Featured on</p>
        <p className="font-bold">ReviewsUp.io</p>
      </div>
      <div className="flex flex-col items-center justify-center px-1">
        <div className="flex flex-row items-center gap-0">
          <span className="font-semibold text-[1.0rem]">
            {averageRatingFixed}
          </span>
          <StarServer isActive={true} size={'sm'} />
        </div>
        <span className="cursor-pointer hover:cursor-pointer hover:underline text-[0.6rem] text-gray-600">
          {totalReviews} reviews
        </span>
      </div>
    </div>
  );
}
