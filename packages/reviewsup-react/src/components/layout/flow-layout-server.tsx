import { FlowLayoutClient } from './flow-layout-client';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';

interface FlowLayoutServerProps {
  items: ReviewEntity[];
  config?: ShowcaseConfig;
}

export function FlowLayoutServer({ items, config }: FlowLayoutServerProps) {
  return <FlowLayoutClient items={items} config={config} />;
}
