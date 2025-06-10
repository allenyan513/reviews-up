'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/review-import-manual-dialog/star-rating';
import { Review } from '@repo/database/generated/client';
import { cn } from '@/lib/utils';

export function ReviewItem(props: { review: Review; className?: string }) {
  if (!props.review) {
    return <div className="text-gray-500">No review data available.</div>;
  }

  return (
    <div
      key={props.review.id}
      className={cn(
        'bg-white py-4 pl-4 pr-12 border rounded shadow flex flex-row gap-4',
        props.className,
      )}
    >
      <Avatar className="size-12 shadow-md border">
        <AvatarImage
          src={props.review.reviewerImage || ''}
          alt={props.review.reviewerName || 'Reviewer'}
        />
        <AvatarFallback className="AvatarFallback" delayMs={600}>
          {props.review.reviewerName.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-md font-semibold">{props.review.reviewerName}</h2>
        <p className="text-gray-700 text-sm mb-4">
          {props.review.createdAt.toLocaleString('en-US')}
        </p>
        <StarRating
          className="mb-2"
          value={props.review.rating || 5}
          onChange={() => {}}
        />
        <p className="text-gray-700 overflow-x-clip">{props.review.text}</p>
      </div>
    </div>
  );
}
