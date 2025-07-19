'use client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import React, { useState } from 'react';
import { RatingSummary } from '../rating-summary';
import { PoweredBy } from '../powered-by';
import { toLocalDateString } from '../../lib/utils';
import { ReviewItemSource } from '../item/review-item-source';
import { StarRatingServer } from '../star-rating.server';

/**
 * @param props
 * @constructor
 */
export function AvatarListLayout(props: {
  items: ReviewEntity[];
  config: WidgetConfig;
}) {
  const { items, config } = props;
  const [currentItem, setCurrentItem] = useState<ReviewEntity | null>(
    items[0] || null,
  );

  if (!items || items.length === 0) {
    return null;
  }

  if (items.length % 2 === 0) {
    items.pop();
  }
  const row1 = items.slice(0, Math.ceil(items.length / 2));
  const row2 = items.slice(Math.ceil(items.length / 2));

  return (
    <div
      // className="w-full flex flex-col  justify-center  items-center gap-2 text-black"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'black',
      }}
    >
      <div
        // className="flex flex-row gap-4 overflow-x-scroll scrollbar-hide"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          overflowX: 'auto',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          WebkitOverflowScrolling: 'touch', // Smooth scrolling for iOS
        }}
      >
        {row1.map((item, idx) => {
          if (!item.reviewerImage) {
            return (
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '9999px',
                  backgroundColor: '#E5E7EB', // Tailwind's bg-gray-200
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6B7280', // Tailwind's text-gray-500
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setCurrentItem(item)}
              >
                <span>
                  {item.reviewerName
                    ? item.reviewerName.charAt(0).toUpperCase()
                    : 'U'}
                </span>
              </div>
            );
          } else {
            return (
              <img
                key={item.id}
                src={item.reviewerImage}
                alt={item.reviewerName}
                // className="rounded-full object-cover border w-12 h-12 shadow cursor-pointer"
                style={{
                  borderRadius: '9999px',
                  objectFit: 'cover',
                  border: '1px solid #e5e7eb',
                  width: '3rem',
                  height: '3rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setCurrentItem(item)}
              />
            );
          }
        })}
      </div>
      <div
        // className="flex flex-row gap-4 overflow-x-auto"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          overflowX: 'auto',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          WebkitOverflowScrolling: 'touch', // Smooth scrolling for iOS
        }}
      >
        {row2.map((item, idx) => (
          <img
            key={item.id}
            src={item.reviewerImage}
            alt={item.reviewerName}
            // className="rounded-full object-cover border w-12 h-12 shadow cursor-pointer"
            style={{
              borderRadius: '9999px',
              objectFit: 'cover',
              border: '1px solid #e5e7eb',
              width: '3rem',
              height: '3rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setCurrentItem(item)}
          />
        ))}
      </div>
      {currentItem && (
        <div
          // className="flex flex-col items-center text-center gap-2 mt-8"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            marginTop: '2rem',
          }}
        >
          <p
            // className="text-2xl max-w-3xl"
            style={{
              fontSize: '1.5rem',
              maxWidth: '48rem',
            }}
          >
            {currentItem.text}
          </p>

          <div
            // className="flex flex-col gap-2 items-center"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            {config.isRatingEnabled && (
              <StarRatingServer value={currentItem.rating || 5} size={'md'} />
            )}
            <div
              // className="flex flex-row items-center gap-4"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <a
                target="_blank"
                href={currentItem.reviewerUrl}
                // className="flex flex-row justify-between "
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  // className="flex flex-row gap-2 py-2 overflow-x-auto"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0.5rem',
                    padding: '0.5rem 0',
                    overflowX: 'auto',
                    scrollbarWidth: 'none', // Hide scrollbar for Firefox
                    WebkitOverflowScrolling: 'touch', // Smooth scrolling for iOS
                  }}
                >
                  <img
                    src={currentItem.reviewerImage}
                    alt={currentItem.reviewerName}
                    // className="rounded-full object-cover shadow w-11 h-11 border border-gray-300 bg-white"
                    style={{
                      borderRadius: '9999px',
                      objectFit: 'cover',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      width: '2.75rem',
                      height: '2.75rem',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#ffffff',
                    }}
                  />
                  <div
                    // className="flex flex-col justify-center text-start"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'start',
                    }}
                  >
                    <p
                      // className="text-md line-clamp-1"
                      style={{
                        fontSize: '1rem',
                        lineClamp: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentItem.reviewerName}
                    </p>
                    <p
                      // className="text-sm text-gray-500 line-clamp-1"
                      style={{
                        fontSize: '0.875rem',
                        color: '#6B7280', // Tailwind's text-gray-500
                        lineClamp: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentItem.reviewerTitle ||
                        toLocalDateString(currentItem.createdAt) ||
                        currentItem.reviewerEmail ||
                        ''}
                    </p>
                  </div>
                </div>
              </a>
              {config.isSourceEnabled && (
                <ReviewItemSource
                  source={currentItem.source as string}
                  sourceUrl={currentItem.sourceUrl}
                  isDoFollowEnabled={config.isDoFollowEnabled}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {config.isRatingSummaryEnabled && (
        <div
          // className="mt-8 w-full flex justify-center"
          style={{
            marginTop: '2rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RatingSummary ratings={items.map((item) => item.rating || 0)} />
        </div>
      )}
      {config.isPoweredByEnabled && <PoweredBy />}
    </div>
  );
}
