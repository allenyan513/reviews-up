'use client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { BiSolidQuoteLeft } from 'react-icons/bi';
import { ShowcaseConfig } from '@reviewsup/api/showcases';
import StarRating from '../star-rating';
import { ReviewItemSource } from './review-item-source';
import { toLocalDateString } from '../../lib/utils';

export function ReviewItem1(props: {
  review: ReviewEntity;
  config: ShowcaseConfig;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { review, config, className, style = {} } = props;
  const {
    isSourceEnabled = true,
    isRatingEnabled = true,
    isDoFollowEnabled = true,
  } = config;

  if (!review) {
    return null;
  }
  return (
    <div
      key={review.id}
      className={`flex flex-col justify-between gap-2 p-4 text-black bg-white rounded-lg shadow-lg ${className}`}
      style={{ ...style }}
    >
      <div className="flex flex-col gap-2 flex-grow min-h-0 overflow-hidden">
        <BiSolidQuoteLeft className="w-8 h-8 min-h-8" />
        <p className="text-black whitespace-break-spaces overflow-auto flex-grow min-h-0" >
          {review.text}
        </p>
      </div>
      <div className="flex flex-col">
        {isRatingEnabled && (
          <StarRating value={review.rating || 5} onChange={null} size={'md'} />
        )}
        <div className="flex flex-row justify-between items-center">
          <a
            target="_blank"
            href={review.reviewerUrl}
            className="flex flex-row justify-between "
          >
            <div className="flex flex-row gap-2 py-2 overflow-x-auto">
              <img
                src={review.reviewerImage}
                alt={review.reviewerName}
                className="rounded-full object-cover shadow w-11 h-11 border border-gray-300 bg-white"
              />
              <div className="flex flex-col justify-center">
                <p className="text-md line-clamp-1">{review.reviewerName}</p>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {review.reviewerTitle ||
                    toLocalDateString(review.createdAt) ||
                    review.reviewerEmail ||
                    ''}
                </p>
              </div>
            </div>
          </a>
          {isSourceEnabled && (
            <ReviewItemSource
              className="mr-2"
              source={review.source as string}
              sourceUrl={review.sourceUrl}
              isDoFollowEnabled={isDoFollowEnabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
