'use client';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
import { useState } from 'react';
import { BiSolidQuoteLeft } from 'react-icons/bi';
import { RatingSummary } from '../RatingSummary';

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
    <div className="w-full flex flex-col  justify-center  items-center gap-2">
      <div className="flex flex-row gap-4 overflow-x-auto">
        {row1.map((item, idx) => (
          <img
            key={item.id}
            src={item.reviewerImage}
            alt={item.reviewerName}
            className="rounded-full object-cover border"
            style={{
              width: '44px',
              height: '44px',
            }}
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
            className={`rounded-full object-cover border `}
            style={{
              width: '44px',
              height: '44px',
            }}
            onMouseEnter={() => setCurrentItem(item)}
          />
        ))}
      </div>
      {currentItem && (
        <div className="flex flex-col items-center text-center gap-2 mt-8">
          <p className="text-2xl max-w-xl">
            <span>
              <BiSolidQuoteLeft className="w-6 h-6" />
            </span>
            {currentItem.text}
          </p>
          <p className="text-sm mt-4">{currentItem.reviewerTitle}</p>
          <img
            src={currentItem.reviewerImage}
            alt={currentItem.reviewerName}
            className="rounded-full object-cover border"
            style={{
              width: '44px',
              height: '44px',
            }}
          />
        </div>
      )}
      {config.isRatingSummaryEnabled && (
        <div className='mt-8 w-full flex justify-center'>
          <RatingSummary
            ratings={items.map(item => item.rating || 0)}
          />
        </div>
      )}
    </div>
  );
}
