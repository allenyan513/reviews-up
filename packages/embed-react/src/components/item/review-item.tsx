import { ReviewItemSource } from './review-item-source';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { toLocalDateString } from '../../lib/utils';
import { StarRatingServer } from '../star-rating.server';
import styled from 'styled-components';

//  style={{
//         boxSizing: 'border-box',
//         backgroundColor: '#ffffff',
//         padding: '1rem',
//         border: '1px solid #e5e7eb',
//         borderRadius: '0.375rem',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '1rem',
//         width: '100%',
//       }}
const ReviewItemRoot = styled.div`
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  cursor: pointer;
`;

const ReviewItemHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export function ReviewItem(props: {
  review: ReviewEntity;
  config?: WidgetConfig;
}) {
  const { review, config } = props;
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
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '0.375rem', // Tailwind's rounded class
          }}
        />
      );
    } else if (imageMedias.length == 2) {
      return (
        <div
          // className="grid grid-cols-2 gap-2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem', // Tailwind's gap-2
          }}
        >
          {imageMedias.map((media) => (
            <img
              key={media.id}
              src={media.url}
              alt={media.url}
              // className="w-full h-auto rounded"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '0.375rem', // Tailwind's rounded class
              }}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div
          // className="grid grid-cols-3 gap-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem', // Tailwind's gap-4
          }}
        >
          {imageMedias.map((media) => (
            <img
              key={media.id}
              src={media.url}
              alt={media.url}
              // className="w-full h-auto rounded"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '0.375rem', // Tailwind's rounded class
              }}
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
          // className="w-full h-auto rounded"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '0.375rem', // Tailwind's rounded class
          }}
        />
      );
    }
    return null;
  };

  return (
    <ReviewItemRoot key={review.id}>
      <ReviewItemHeader>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            gap: '0.5rem',
            overflowX: 'auto',
            alignItems: 'center',
          }}
        >
          <a
            target="_blank"
            href={review.reviewerUrl}
            rel={
              isDoFollowEnabled
                ? 'noopener noreferrer'
                : 'nofollow noopener noreferrer'
            }
            // className="flex flex-row gap-3"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.75rem',
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
            <div>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#111827', // Tailwind's text-gray-900
                  fontWeight: '600',
                  lineClamp: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {review.reviewerName}
              </p>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6B7280', // Tailwind's text-gray-500
                  lineClamp: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {review.reviewerTitle ||
                  toLocalDateString(review.createdAt) ||
                  review.reviewerEmail ||
                  ''}
              </p>
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
      </ReviewItemHeader>
      {isRatingEnabled && (
        <StarRatingServer value={review.rating || 5} size={'sm'} />
      )}
      {isImageEnabled && renderImageMedias()}
      {isVideoEnabled && renderVideoMedias()}
      <p
        style={{
          color: '#374151',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: '1.5',
        }}
      >
        {review.text}
      </p>
    </ReviewItemRoot>
  );
}
