import { ReviewEntity } from '@repo/api/reviews';
import { ShowcaseConfig } from '@repo/api/showcases';
import { ListLayoutClient } from './list-layout-client';

interface ListLayoutServerProps {
  items: ReviewEntity[];
  config?: ShowcaseConfig;
}

export function ListLayoutServer({ items, config }: ListLayoutServerProps) {
  return <ListLayoutClient items={items} config={config} />;
}
