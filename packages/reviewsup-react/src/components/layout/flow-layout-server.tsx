import { FlowLayoutClient } from './flow-layout-client';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';

interface FlowLayoutServerProps {
  items: ReviewEntity[];
  config?: ShowcaseConfig;
}

export default function FlowLayoutServer({
  items,
  config,
}: FlowLayoutServerProps) {
  return (
    <FlowLayoutClient
      items={items}
      config={config}
      breakpoints={{ sm: 1, md: 2, lg: 3 }}
      defaultColumns={3}
    />
  );
}
