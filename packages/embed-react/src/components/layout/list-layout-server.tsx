import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { ListLayoutClient } from './list-layout-client';

interface ListLayoutServerProps {
  items: ReviewEntity[];
  config?: WidgetConfig;
}

export function ListLayoutServer({ items, config }: ListLayoutServerProps) {
  return <ListLayoutClient items={items} config={config} />;
}
