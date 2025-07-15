import { ReviewItemSource } from './review-item-source';
import { StarRating } from '../star-rating';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { toLocalDateString } from '../../lib/utils';

export function ReviewItem(props: {
  review: ReviewEntity;
  config?: WidgetConfig;
  className?: string;
}) {
  const { review, config, className } = props;
  const {
    isSourceEnabled,
    isVideoEnabled,
    isImageEnabled,
    isRatingEnabled,
    isDoFollowEnabled,
  } = (config as WidgetConfig) || {
    isSourceEnabled: true,
    isVideoEnabled: true,
    isImageEnabled: true,
    isRatingEnabled: true,
    isDoFollowEnabled: true,
  };

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
          className="w-full h-auto rounded"
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
              className="w-full h-auto rounded"
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
              className="w-full h-auto rounded"
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
          className="w-full h-auto rounded"
        />
      );
    }
    return null;
  };

  return (
    <div
      key={review.id}
      className={`bg-white p-4 border border-gray-300 rounded-md shadow-sm flex flex-col gap-4 ${className}`}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-full justify-between gap-2 overflow-x-auto items-center">
          <a
            target="_blank"
            href={review.reviewerUrl}
            rel={
              isDoFollowEnabled
                ? 'noopener noreferrer'
                : 'nofollow noopener noreferrer'
            }
            className="flex flex-row gap-3"
          >
            {review.reviewerImage ? (
              <img
                src={review.reviewerImage}
                alt={review.reviewerName}
                className="w-11 h-11 rounded-full object-cover shadow"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">
                  {review.reviewerName
                    ? review.reviewerName.charAt(0).toUpperCase()
                    : 'U'}
                </span>
              </div>
            )}
            <div className="flex flex-col justify-center">
              <p className="text-md text-black font-semibold line-clamp-1">
                {review.reviewerName}
              </p>
              <p className="text-sm text-gray-500 line-clamp-1">
                {review.reviewerTitle ||
                  toLocalDateString(review.createdAt) ||
                  review.reviewerEmail ||
                  ''}
              </p>
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
      {isRatingEnabled && <StarRating value={review.rating || 5} />}
      {isImageEnabled && renderImageMedias()}
      {isVideoEnabled && renderVideoMedias()}
      <p className="text-gray-700 overflow-x-auto whitespace-pre-wrap">
        {review.text}
      </p>
    </div>
  );
}
