'use client';

import React, {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';

interface FlowLayoutProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  columns?: number; // 默认值3
  columnGap?: number; // 列间距，单位px，默认为16px
  rowGap?: number; // 行间距，单位px，默认为16px
}

export default function FlowLayout<T>({
  items,
  renderItem,
  className,
  columns = 3,
  columnGap = 16,
  rowGap = 16,
}: FlowLayoutProps<T>) {
  const [columnHeights, setColumnHeights] = useState<number[]>(
    Array(columns).fill(0),
  );
  const [renderedColumns, setRenderedColumns] = useState<ReactNode[][]>(
    Array(columns)
      .fill(null)
      .map(() => []),
  );
  // 用来存储每个 item 的高度的引用，以便在渲染后获取
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 测量并分配 item 到正确的列
  const distributeItems = useCallback(() => {
    // 每次重新计算时，重置列高度和内容
    const newColumnHeights = Array(columns).fill(0);
    const newRenderedColumns: ReactNode[][] = Array(columns)
      .fill(null)
      .map(() => []);

    // 清空 itemRefs，防止旧的引用影响新的渲染
    itemRefs.current = [];

    // 这里先简单地将 item 放入对应的列中
    // 实际渲染时，我们会动态计算高度并决定放入哪一列
    // 在 useEffect 中进行实际的高度测量和分配
    items.forEach((item, idx) => {
      // 先将所有 item 放入一个临时结构，方便在渲染后获取其高度
      newRenderedColumns[idx % columns]?.push(
        <div
          key={idx}
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          style={{ marginBottom: `${rowGap}px` }} // 添加行间距
        >
          {renderItem(item, idx)}
        </div>,
      );
    });

    setColumnHeights(newColumnHeights); // 这个状态在首次渲染后会更新
    setRenderedColumns(newRenderedColumns);
  }, [items, columns, renderItem, rowGap]);

  // 在组件挂载和 items 或 columns 变化时重新计算布局
  useEffect(() => {
    if (items.length === 0) {
      setRenderedColumns(
        Array(columns)
          .fill(null)
          .map(() => []),
      );
      setColumnHeights(Array(columns).fill(0));
      return;
    }

    const newColumnHeights = Array(columns).fill(0);
    const tempColumns: ReactNode[][] = Array(columns)
      .fill(null)
      .map(() => []);

    // 重新分配 item，根据高度放入最短的列
    // 注意：这里的循环会等待 DOM 渲染完成，然后获取高度
    // 如果 itemRef 还没有值 (比如首次渲染前)，则可能无法获取高度
    // 更健壮的方案是先渲染一次获取高度，再根据高度重新分配
    // 这里采用一个简化的方法，通过测量已渲染的元素
    items.forEach((item, idx) => {
      // 找到当前最短的列
      const minHeight = Math.min(...newColumnHeights);
      const minHeightColumnIndex = newColumnHeights.indexOf(minHeight);

      // 将 item 放入最短的列
      // 这里我们不再直接渲染 renderItem，而是将它包装起来以便获取高度
      const itemElement = (
        <div
          key={idx}
          // 在渲染完成后，通过 ref 获取实际高度
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          style={{ marginBottom: `${rowGap}px` }} // 添加行间距
        >
          {renderItem(item, idx)}
        </div>
      );

      tempColumns[minHeightColumnIndex]?.push(itemElement);
      // 注意：这里我们不能立即更新 newColumnHeights，因为 itemElement 的高度还未测量到
      // 我们需要在下一次 effect 循环或 layout effect 中获取高度

      // 在这里，我们需要一个机制来获取 itemElement 的实际高度
      // 最直接的方法是等到 DOM 渲染完成后，再通过 ref 获取。
      // 所以，这个分配逻辑最好放在一个单独的 effect 中，
      // 在 itemRefs.current 的值可用之后执行。
    });

    // 第一次设置，先按照简单的 % 方式进行分配
    setRenderedColumns(tempColumns);

    // 等待 DOM 渲染完成，然后测量高度并重新分配
    const measureAndRedistribute = () => {
      const finalColumnHeights = Array(columns).fill(0);
      const finalRenderedColumns: ReactNode[][] = Array(columns)
        .fill(null)
        .map(() => []);

      // 重新对 item 进行排序和分配，这次是基于实际高度
      const itemsWithHeights = items
        .map((item, idx) => {
          const height = itemRefs.current[idx]?.offsetHeight || 0; // 获取真实高度
          return { item, idx, height };
        })
        .sort((a, b) => a.idx - b.idx); // 保持原始顺序进行分配

      itemsWithHeights.forEach(({ item, idx, height }) => {
        const minHeight = Math.min(...finalColumnHeights);
        const minHeightColumnIndex = finalColumnHeights.indexOf(minHeight);

        finalRenderedColumns[minHeightColumnIndex]?.push(
          <div
            key={idx}
            // 再次设置 ref，确保在重新渲染时仍然能正确关联
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            style={{ marginBottom: `${rowGap}px` }}
          >
            {renderItem(item, idx)}
          </div>,
        );
        finalColumnHeights[minHeightColumnIndex] += height + rowGap; // 加上行间距
      });

      setRenderedColumns(finalRenderedColumns);
      setColumnHeights(finalColumnHeights);
    };

    // 使用 requestAnimationFrame 或 setTimeout(0) 来确保在 DOM 渲染后执行测量
    // 或者更推荐使用 `useLayoutEffect` 如果你需要同步测量并防止闪烁
    // 这里为了演示，使用 setTimeout 模拟
    const timeoutId = setTimeout(measureAndRedistribute, 0);

    return () => clearTimeout(timeoutId); // 清除定时器
  }, [items, columns, renderItem, rowGap]); // 依赖项

  return (
    <div
      className={className}
      style={{
        display: 'flex', // 使用 flex 容器来容纳列
        gap: `${columnGap}px`, // 列间距
        alignItems: 'flex-start', // 确保列顶部对齐
      }}
    >
      {renderedColumns.map((colItems, colIdx) => (
        <div
          key={colIdx}
          style={{
            flex: 1, // 每列占据等分空间
            minWidth: 0, // 允许内容收缩
          }}
        >
          {colItems}
        </div>
      ))}
    </div>
  );
}
