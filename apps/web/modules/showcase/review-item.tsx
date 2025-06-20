'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/modules/review/manual/star-rating';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { cn, toLocalDateString } from '@/lib/utils';
import Link from 'next/link';
import { ReviewItemSource } from '@/modules/showcase/review-item-source';

export function ReviewItem(props: {
  review: ReviewEntity;
  isSourceEnabled?: boolean | undefined;
  isVideoEnabled?: boolean | undefined;
  isImageEnabled?: boolean | undefined;
  isDateEnabled?: boolean | undefined;
  isRatingEnabled?: boolean | undefined;
  className?: string;
}) {
  const {
    review,
    className,
    isSourceEnabled = true,
    isVideoEnabled = true,
    isImageEnabled = true,
    isDateEnabled = true,
    isRatingEnabled = true,
  } = props;
  if (!review) {
    return null;
  }
  const imageMedias = review.medias?.filter((media) => media.type === 'image');
  const videoMedias = review.medias?.filter((media) => media.type === 'video');
  /**
   * gird layout for image medias
   * if image length is 1, show it in a single
   * if image length is 2, show them in grid with 2 columns
   * if image length greater than 3, show them in row with 3 columns
   */
  const renderImageMedias = () => {
    if (!imageMedias || imageMedias.length === 0) {
      return null;
    }

    if (imageMedias.length === 1) {
      return (
        <img
          key={imageMedias[0]?.id}
          src={imageMedias[0]?.url}
          alt={imageMedias[0]?.url}
          className="w-full h-auto rounded-lg shadow-md"
        />
      );
    } else if (imageMedias.length == 2) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {imageMedias.map((media) => (
            <img
              key={media.id}
              src={media.url}
              alt={media.url}
              className="w-full h-auto rounded-lg shadow-md"
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-3 gap-4">
          {imageMedias.map((media) => (
            <img
              key={media.id}
              src={media.url}
              alt={media.url}
              className="w-full h-auto rounded-lg shadow-md"
            />
          ))}
        </div>
      );
    }
  };

  /**
   * Renders video medias
   * video will only be one
   */
  const renderVideoMedias = () => {
    if (videoMedias && videoMedias.length > 0) {
      return (
        <video
          key={videoMedias[0]?.id}
          src={videoMedias[0]?.url}
          controls
          className="w-full h-auto rounded-lg shadow-md"
        />
      );
    }
    return null;
  };

  return (
    <div
      key={review.id}
      className={cn(
        'bg-white p-4 border rounded shadow flex flex-col gap-4',
        className,
      )}
    >
      <Link
        target="_blank"
        href={review.reviewerUrl || '#'}
        className="flex flex-row justify-between"
      >
        <div className="flex flex-row gap-4 overflow-x-auto">
          <Avatar className="size-11 shadow-md border">
            <AvatarImage
              src={review.reviewerImage || ''}
              alt={review.reviewerName || 'Reviewer'}
            />
            <AvatarFallback className="AvatarFallback" delayMs={600}>
              {review.reviewerName.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <p className="text-md font-semibold line-clamp-1">
              {review.reviewerName}
            </p>
            {isDateEnabled && (
              <p className="text-gray-700 text-sm">
                {toLocalDateString(review.createdAt)}
              </p>
            )}
          </div>
        </div>
        {isSourceEnabled && (
          <ReviewItemSource source={review.source as string} />
        )}
      </Link>
      {isRatingEnabled && (
        <StarRating value={review.rating || 5} onChange={() => {}} />
      )}
      {isImageEnabled && renderImageMedias()}
      {isVideoEnabled && renderVideoMedias()}
      <p className="text-gray-700 overflow-x-auto whitespace-break-spaces ">
        {review.text}
      </p>
    </div>
  );
}
