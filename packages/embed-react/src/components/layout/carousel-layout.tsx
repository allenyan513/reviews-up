'use client'

import { useRef, useEffect } from 'react';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { RatingSummary } from '../rating-summary';
import { PoweredBy } from '../powered-by';
import { renderItem } from '../item';
import styled from 'styled-components'

// <div className="absolute top-0 left-0 w-[100px] h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />

const RightGradientStyles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(to right, white, transparent);
  pointer-events: none;
`;

const LeftGradientStyles = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(to left, white, transparent);
  pointer-events: none;
`;

function CarouselRow({
  items,
  config,
  reverse,
  speed,
}: {
  items: ReviewEntity[];
  config: WidgetConfig;
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
    <div
      // className="w-full relative overflow-x-hidden"
      style={{
        width: '100%',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          padding: '1rem',
          willChange: 'transform'
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx}>
            {renderItem(item, 'style-1', config, '400px', '300px')}
          </div>
        ))}
      </div>
      <RightGradientStyles />
      <LeftGradientStyles />
    </div>
  );
}

export function CarouselLayout(props: {
  items: ReviewEntity[];
  config: WidgetConfig;
}) {
  const { items, config } = props;
  const { rows = 1, speed = 40 } = config;
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
    <div
      // className="hidden md:flex md:flex-col gap-4 w-full"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
      }}
    >
      <div
        // className="w-full flex flex-col"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {rowsOfItems.map((rowItems, rowIndex) => {
          const rowReverse = rowIndex % 2 !== 0;
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
      {config.isRatingSummaryEnabled && (
        <RatingSummary ratings={items.map((item) => item.rating || 0)} />
      )}
      {config.isPoweredByEnabled && <PoweredBy />}
    </div>
  );
}
