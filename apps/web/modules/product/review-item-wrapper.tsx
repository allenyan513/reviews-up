'use client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { ReviewItem } from '@reviewsup/embed-react';

export function ReviewItemsWrapper(props: { reviews: ReviewEntity[] }) {
  const { reviews } = props;
  if (!reviews || reviews.length === 0) {
    return <p>No reviews available</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((item) => (
        <ReviewItem key={item.id} review={item} />
      ))}
    </div>
  );
}
