// No 'use client'

import { ReactNode } from 'react';

interface FlowLayoutServerProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  columns?: number;
}

export default function FlowLayoutServer<T>({
  items,
  renderItem,
  columns = 3,
}: FlowLayoutServerProps<T>) {
  const renderedColumns: ReactNode[][] = Array(columns)
    .fill(null)
    .map(() => []);

  items.forEach((item, idx) => {
    renderedColumns[idx % columns].push(renderItem(item, idx));
  });

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {renderedColumns.map((colItems, colIdx) => (
        <div key={colIdx} style={{ flex: 1 }}>
          {colItems.map((child, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              {child}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
