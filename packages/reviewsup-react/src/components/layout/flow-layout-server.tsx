import { FlowLayoutClient } from './flow-layout-client';
import { ReviewEntity } from '@repo/api/reviews';
import { ShowcaseConfig } from '@repo/api/showcases';

interface FlowLayoutServerProps {
  items: ReviewEntity[];
  config?: ShowcaseConfig;
}

export function FlowLayoutServer({ items, config }: FlowLayoutServerProps) {
  return <FlowLayoutClient items={items} config={config} />;
}
