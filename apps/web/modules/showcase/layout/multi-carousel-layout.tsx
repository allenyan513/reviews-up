'use client';
import { ReactNode, useRef, useEffect } from 'react';

interface MultiCarouselLayoutProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  direction?: 'forward' | 'reverse'; // Optional: 'forward' by default
  speed?: number; // Optional: 40px/sec by default
}

function MultiCarouselRow<T>({
  items,
  renderItem,
  reverse = false,
  speed = 40,
}: {
  items: T[];
  renderItem: (item: T, originalIndex: number) => ReactNode; // 传递原始索引
  reverse?: boolean;
  speed?: number;
}) {
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
    <div ref={containerRef} className="overflow-hidden w-full">
      <div
        ref={ref}
        className="flex whitespace-nowrap"
        style={{ willChange: 'transform' }} // Optimize for animation
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item ? (item as any).id || idx : idx}-${idx}`}
            className="mx-2 inline-block"
          >
            {renderItem(item, idx % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Function to distribute items into N rows
function distributeItems<T>(items: T[], numRows: number): T[][] {
  if (numRows <= 0) return [];
  if (items.length === 0) return Array(numRows).fill([]);

  const result: T[][] = Array(numRows)
    .fill(null)
    .map(() => []);
  const itemsPerSlice = Math.ceil(items.length / numRows); // Calculate average items per slice

  for (let i = 0; i < items.length; i++) {
    const rowIdx = Math.floor(i / itemsPerSlice); // Simple sequential distribution
    result[rowIdx % numRows]?.push(items[i] || ({} as T)); // Ensure we don't push undefined
  }
  return result;
}

export default function MultiCarouselLayout<T>({
  items,
  renderItem,
  className,
  direction = 'forward', // Default direction
  speed,
}: MultiCarouselLayoutProps<T>) {
  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      <MultiCarouselRow
        items={items}
        renderItem={renderItem}
        reverse={direction === 'reverse'}
        speed={speed ?? 40} // Default speed
      />
    </div>
  );
}
