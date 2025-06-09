'use client';
import { ReactNode } from 'react';
interface GridLayoutProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  columns?: number;
}

export default function GridLayout<T>({
  items,
  renderItem,
  className,
  columns = 3,
}: GridLayoutProps<T>) {
  return (
    <div
      className={`grid gap-4 ${className ?? ''}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item, idx) => (
        <div key={idx}>{renderItem(item, idx)}</div>
      ))}
    </div>
  );
}
