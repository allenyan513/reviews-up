'use client';
import { useRef, useEffect } from 'react';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
import { ReviewItem1 } from '../item/review-item-1';

export function SingleCarouselLayout(props: {
  items: ReviewEntity[];
  config: ShowcaseConfig;
  reverse?: boolean;
  speed?: number;
}) {
  const { items, config, reverse = false, speed = 40 } = props;
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // 用于获取容器宽度，以便计算复制次数

  useEffect(() => {
    const el = ref.current;
    const containerEl = containerRef.current;
    if (!el || !containerEl || items.length === 0) return;
    let animationFrameId: number;
    let currentPosition = 0; // Current position for translateX
    const contentWidth = el.scrollWidth / 2; // Because we duplicate items
    const animate = () => {
      const movementPerFrame = speed / 60;
      if (reverse) {
        currentPosition += movementPerFrame;
        if (currentPosition >= contentWidth) {
          currentPosition -= contentWidth; // Move back by one content width
        }
      } else {
        currentPosition -= movementPerFrame;
        if (currentPosition <= -contentWidth) {
          currentPosition += contentWidth; // Move forward by one content width
        }
      }
      el.style.transform = `translateX(${currentPosition}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [items, reverse, speed]); // Dependencies: items (if content changes), direction, speed
  // Duplicate items for seamless loop. Ensure items are not empty.
  const duplicatedItems = items.length > 0 ? [...items, ...items] : [];

  return (
    <div ref={containerRef} className="overflow-hidden w-full relative">
      <div
        ref={ref}
        style={{ willChange: 'transform' }}
        className="flex flex-row gap-4 p-4"
      >
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
