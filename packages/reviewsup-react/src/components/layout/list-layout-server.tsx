import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
import { ListLayoutClient } from './list-layout-client';

interface ListLayoutServerProps {
  items: ReviewEntity[];
  config?: ShowcaseConfig;
}

export default function ListLayoutServer({
  items,
  config,
}: ListLayoutServerProps) {
  return <ListLayoutClient items={items} config={config} />;
}
