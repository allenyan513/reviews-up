'use client';
import { ReactNode, useRef, useEffect } from 'react';

// MarqueeRowConfig 只需要 direction 和 speed
export interface MarqueeRowConfig {
  direction?: 'forward' | 'reverse'; // Optional: 'forward' by default
  speed?: number; // Optional: 40px/sec by default
}

interface MarqueeLayoutProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  // 新增 rowsCount 来指定行数，同时使用 rowsConfig 来配置每行的方向和速度
  rowsConfig: MarqueeRowConfig[];
}

function MarqueeRow<T>({
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

    // 如果没有元素或没有内容，则不执行动画
    if (!el || !containerEl || items.length === 0) return;

    let animationFrameId: number;
    let currentPosition = 0; // Current position for translateX

    // Calculate the width of one set of items
    // This is crucial for determining when to reset the position
    // We assume the first set of items in el.children represents one full set.
    // If renderItem can return varying widths, this needs to be more robust.
    // For simplicity, we get the scrollWidth, which includes padding/margin.
    const contentWidth = el.scrollWidth / 2; // Because we duplicate items

    const animate = () => {
      // Calculate movement per frame (e.g., speed pixels per second / 60 frames per second)
      const movementPerFrame = speed / 60;

      if (reverse) {
        // Moving right (translateX positive values)
        currentPosition += movementPerFrame;
        // If the content has moved past the duplicated section (i.e., more than one full content width)
        // Reset position to seamlessly transition to the duplicated part
        if (currentPosition >= contentWidth) {
          currentPosition -= contentWidth; // Move back by one content width
        }
      } else {
        // Moving left (translateX negative values)
        currentPosition -= movementPerFrame;
        // If the content has moved past the duplicated section (i.e., more than one full content width)
        // Reset position to seamlessly transition to the duplicated part
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
          // Use original item's index for renderItem to keep context
          // Use a more robust key if items are not stable or have IDs
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

export default function MarqueeLayout<T>({
  items,
  renderItem,
  className,
  rowsConfig, // Array of row configurations
}: MarqueeLayoutProps<T>) {
  // Validate rowsConfig
  if (!rowsConfig || rowsConfig.length === 0) {
    console.warn(
      'MarqueeLayout: rowsConfig must be an array with at least one configuration.',
    );
    return null;
  }

  // Distribute items based on the number of configurations in rowsConfig
  const distributedItems = distributeItems(items, rowsConfig.length);

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {rowsConfig.map((rowConfig, index) => {
        const rowItems = distributedItems[index];

        if (!rowItems || rowItems.length === 0) {
          // This can happen if items.length < rowsConfig.length for later rows
          // Or if distributeItems logic is simpler and leaves some rows empty
          console.warn(`MarqueeLayout: Row ${index} has no items assigned.`);
          return null; // Don't render an empty row
        }

        return (
          <MarqueeRow
            key={index} // Use index as key, assuming rowsConfig order is stable
            items={rowItems}
            renderItem={renderItem}
            reverse={rowConfig.direction === 'reverse'}
            speed={rowConfig.speed}
          />
        );
      })}
    </div>
  );
}
