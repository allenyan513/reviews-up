import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import Link from 'next/link';
import { ReviewItemSource } from './review-item-source';
import StarRating from './star-rating';
import '../styles/output.css';

function toLocalDateString(date: Date | string): string {
  const _date = new Date(date);
  // 获取浏览器语言
  const locale =
    typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(_date);
}

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
      style={{
        backgroundColor: 'white',
        padding: '1rem',
        border: '1px solid #d1d5db', // gray-300
        borderRadius: '0.375rem', // rounded-md
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Link
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_APP_URL}/profile/${review.reviewerId}`}
        className="flex flex-row justify-between"
      >
        <div className="flex flex-row gap-2 overflow-x-auto">
          <div
            style={{
              position: 'relative',
            }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={review.reviewerImage}
                alt={review.reviewerName}
                className="w-10 h-10 rounded-full object-cover shadow"
              />
            </div>
            <ReviewItemSource source={review.source as string} />
          </div>
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
      </Link>
      {isRatingEnabled && (
        <StarRating value={review.rating || 5} onChange={() => {}} />
      )}
      <p className="text-gray-700 overflow-x-auto whitespace-break-spaces ">
        {review.text}
      </p>
      {isImageEnabled && renderImageMedias()}
      {isVideoEnabled && renderVideoMedias()}
    </div>
  );
}
