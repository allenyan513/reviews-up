import { FlowLayoutClient } from './flow-layout-client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { ShowcaseConfig } from '@reviewsup/api/showcases';

interface FlowLayoutServerProps {
  items: ReviewEntity[];
  config?: ShowcaseConfig;
}

export function FlowLayoutServer({ items, config }: FlowLayoutServerProps) {
  return <FlowLayoutClient items={items} config={config} />;
}
