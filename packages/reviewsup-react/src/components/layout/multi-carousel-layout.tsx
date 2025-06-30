'use client';
import { useRef, useEffect } from 'react';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
import { ReviewItem1 } from '../item/review-item-1';

// Internal component for a single carousel row
function CarouselRow({
  items,
  config,
  reverse,
  speed,
}: {
  items: ReviewEntity[];
  config: ShowcaseConfig;
  reverse: boolean;
  speed: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || items.length === 0) return;

    let animationFrameId: number;
    let currentPosition = 0;
    // We duplicate items, so the actual content width is half of the scrollWidth
    const contentWidth = el.scrollWidth / 2;

    // Initialize currentPosition based on direction to avoid initial gap
    if (reverse) {
      currentPosition = -contentWidth; // Start with the second set of items visible
    } else {
      currentPosition = 0; // Start with the first set of items visible
    }

    const animate = () => {
      const movementPerFrame = speed / 60; // 60 frames per second

      if (reverse) {
        currentPosition += movementPerFrame;
        if (currentPosition >= 0) {
          currentPosition -= contentWidth;
        }
      } else {
        currentPosition -= movementPerFrame;
        if (currentPosition <= -contentWidth) {
          currentPosition += contentWidth;
        }
      }
      el.style.transform = `translateX(${currentPosition}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [items, reverse, speed]);

  // Duplicate items for seamless looping. Ensure items are not empty.
  const duplicatedItems = items.length > 0 ? [...items, ...items] : [];

  return (
    <div className="overflow-hidden w-full relative">
      <div ref={ref} className="flex flex-row gap-4 p-4" style={{ willChange: 'transform' }}>
        {duplicatedItems.map((item, idx) => (
          <div key={`${item ? (item as any).id || idx : idx}-${idx}`}>
            <ReviewItem1
              key={item.id}
              isSourceEnabled={config.isSourceEnabled}
              isVideoEnabled={config.isVideoEnabled}
              isImageEnabled={config.isImageEnabled}
              isDateEnabled={config.isDateEnabled}
              isRatingEnabled={config.isRatingEnabled}
              review={item}
            />
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 w-[100px] h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[100px] h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
}

export function MultiCarouselLayout(props: {
  items: ReviewEntity[];
  config: ShowcaseConfig;
  rows?: number;
  reverse?: boolean; // Base reverse direction for the first row
  speed?: number;
}) {
  const { items, config, rows = 2, reverse = false, speed = 40 } = props;

  // Split items into specified number of rows
  const distributeItemsIntoRows = (
    allData: ReviewEntity[],
    numRows: number,
  ) => {
    if (numRows <= 0) return [allData]; // Handle invalid rows
    const result: ReviewEntity[][] = Array.from({ length: numRows }, () => []);
    allData.forEach((item, index) => {
      result[index % numRows].push(item);
    });
    return result;
  };

  const rowsOfItems = distributeItemsIntoRows(items, rows);

  return (
    <div className="w-full flex flex-col">
      {rowsOfItems.map((rowItems, rowIndex) => {
        const rowReverse = rowIndex % 2 === 0 ? reverse : !reverse;
        return (
          <CarouselRow
            key={rowIndex}
            items={rowItems}
            config={config}
            reverse={rowReverse}
            speed={speed}
          />
        );
      })}
    </div>
  );
}
