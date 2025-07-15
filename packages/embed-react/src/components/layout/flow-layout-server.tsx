import { FlowLayoutClient } from './flow-layout-client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';

interface FlowLayoutServerProps {
  items: ReviewEntity[];
  config?: WidgetConfig;
}

export function FlowLayoutServer({ items, config }: FlowLayoutServerProps) {
  return <FlowLayoutClient items={items} config={config} />;
}
