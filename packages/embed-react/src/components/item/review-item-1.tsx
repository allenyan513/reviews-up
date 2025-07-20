import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { ReviewItemSource } from './review-item-source';
import { toLocalDateString } from '../../lib/utils';
import { StarRatingServer } from '../star-rating.server';

export function ReviewItem1(props: {
  review: ReviewEntity;
  config: WidgetConfig;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { review, config, className, style } = props;
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
      // className={`flex flex-col justify-between gap-2 p-4 text-black bg-white rounded-lg shadow-lg ${className}`}
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.5rem',
        padding: '1rem',
        color: 'black',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        // className="flex flex-col gap-2 flex-grow min-h-0 overflow-hidden"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flexGrow: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <p
          // className="text-black whitespace-break-spaces overflow-auto flex-grow min-h-0"
          style={{
            color: 'black',
            whiteSpace: 'break-spaces',
            overflow: 'auto',
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {review.text}
        </p>
      </div>
      <div
        // className="flex flex-col"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isRatingEnabled && (
          <StarRatingServer value={review.rating} size={'md'} />
        )}
        <div
          // className="flex flex-row justify-between items-center"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            target="_blank"
            href={review.reviewerUrl}
            // className="flex flex-row justify-between "
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div
              // className="flex flex-row gap-2 py-2 overflow-x-auto"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '0.5rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                overflowX: 'auto',
              }}
            >
              {review.reviewerImage ? (
                <img
                  src={review.reviewerImage}
                  alt={review.reviewerName}
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '9999px',
                    objectFit: 'cover',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '9999px',
                    backgroundColor: '#E5E7EB', // Tailwind's bg-gray-200
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6B7280', // Tailwind's text-gray-500
                  }}
                >
                <span>
                  {review.reviewerName
                    ? review.reviewerName.charAt(0).toUpperCase()
                    : 'U'}
                </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ fontSize: '1rem', lineClamp: 1 }}>
                  {review.reviewerName}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    lineClamp: 1,
                  }}
                >
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
