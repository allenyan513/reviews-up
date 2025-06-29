'use client';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import Link from 'next/link';
import { BiSolidQuoteLeft } from 'react-icons/bi';

export function ReviewItem2(props: {
  review: ReviewEntity;
  isSourceEnabled?: boolean | undefined;
  isVideoEnabled?: boolean | undefined;
  isImageEnabled?: boolean | undefined;
  isDateEnabled?: boolean | undefined;
  isRatingEnabled?: boolean | undefined;
  className?: string;
}) {
  const { review } = props;
  if (!review) {
    return null;
  }

  return (
    <div
      key={review.id}
      className={`flex flex-col justify-between gap-4 p-4 bg-white rounded-lg shadow-lg ${props.className}`}
    >
      <div className="flex flex-col gap-2">
        <BiSolidQuoteLeft className="w-8 h-8" />
        <p
          className="text-black whitespace-break-spaces"
          style={{
            maxHeight: '140px',
            overflow: 'scroll',
          }}
        >
          {review.text}
        </p>
      </div>

      <Link
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_APP_URL}/profile/${review.reviewerId}`}
        className="flex flex-col gap-2" >
        {/*divider*/}
        <div className="border-t border-gray-200" />
        <div className="flex flex-row gap-3 p-2 overflow-x-auto">
          <img
            src={review.reviewerImage}
            alt={review.reviewerName}
            className="rounded-full object-cover shadow"
            style={{
              width: '44px',
              height: '44px',
            }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-md line-clamp-1">{review.reviewerName}</p>
            <p
              className="text-sm"
              style={{
                color: '#6b7280',
              }}
            >
              {review.reviewerEmail || ''}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
