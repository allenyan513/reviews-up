'use client';
import { ReactNode } from 'react';
interface ListLayoutProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

export default function ListLayout<T>({
  items,
  renderItem,
  className,
}: ListLayoutProps<T>) {
  if (!items || items.length === 0) {
    return <div className="text-gray-500">No items to display.</div>;
  }

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {items.map((item, idx) => (
        <div key={idx}>{renderItem(item, idx)}</div>
      ))}
    </div>
  );
}
