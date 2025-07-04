'use client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { ShowcaseConfig } from '@reviewsup/api/showcases';
import React, { useState } from 'react';
import { BiSolidQuoteLeft } from 'react-icons/bi';
import { RatingSummary } from '../rating-summary';
import { PoweredBy } from '../powered-by';
import StarRating from '../star-rating';
import { toLocalDateString } from '../../lib/utils';
import { ReviewItemSource } from '../item/review-item-source';

/**
 * @param props
 * @constructor
 */
export function AvatarListLayout(props: {
  items: ReviewEntity[];
  config: ShowcaseConfig;
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
    <div className="w-full flex flex-col  justify-center  items-center gap-2 text-black">
      <div className="flex flex-row gap-4 overflow-x-scroll scrollbar-hide">
        {row1.map((item, idx) => (
          <img
            key={item.id}
            src={item.reviewerImage}
            alt={item.reviewerName}
            className="rounded-full object-cover border w-12 h-12 shadow cursor-pointer"
            onMouseEnter={() => setCurrentItem(item)}
          />
        ))}
      </div>
      <div className="flex flex-row gap-4 overflow-x-auto">
        {row2.map((item, idx) => (
          <img
            key={item.id}
            src={item.reviewerImage}
            alt={item.reviewerName}
            className="rounded-full object-cover border w-12 h-12 shadow cursor-pointer"
            onMouseEnter={() => setCurrentItem(item)}
          />
        ))}
      </div>
      {currentItem && (
        <div className="flex flex-col items-center text-center gap-2 mt-8">
          <p className="text-2xl max-w-3xl">
            <span>
              <BiSolidQuoteLeft className="w-6 h-6 mb-2" />
            </span>
            {currentItem.text}
          </p>

          <div className="flex flex-col gap-2 items-center">
            {config.isRatingEnabled && (
              <StarRating value={currentItem.rating || 5} onChange={null} size={'md'} />
            )}
            <div className="flex flex-row items-center gap-4">
              <a
                target="_blank"
                href={currentItem.reviewerUrl}
                className="flex flex-row justify-between "
              >
                <div className="flex flex-row gap-2 py-2 overflow-x-auto">
                  <img
                    src={currentItem.reviewerImage}
                    alt={currentItem.reviewerName}
                    className="rounded-full object-cover shadow w-11 h-11 border border-gray-300 bg-white"
                  />
                  <div className="flex flex-col justify-center text-start">
                    <p className="text-md line-clamp-1">{currentItem.reviewerName}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">
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
                  className="mr-2"
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
        <div className="mt-8 w-full flex justify-center">
          <RatingSummary ratings={items.map((item) => item.rating || 0)} />
        </div>
      )}
      {config.isPoweredByEnabled && <PoweredBy />}
    </div>
  );
}
