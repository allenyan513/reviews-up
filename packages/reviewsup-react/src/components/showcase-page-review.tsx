import { FlowLayoutServer } from './layout/flow-layout-server';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import { ListLayoutServer } from './layout/list-layout-server';
import { SingleCarouselLayout } from './layout/single-carousel-layout';
import { MultiCarouselLayout } from './layout/multi-carousel-layout';
import { AvatarListLayout } from './layout/avatar-list-layout';
import { FixRowLayout } from './layout/fix-row-layout';
import { GridLayout } from './layout/grid-layout';

export async function ShowcasePageReview(props: { showcase: ShowcaseEntity }) {
  const reviews = props.showcase.reviews;
  const config = props.showcase.config as ShowcaseConfig;
  const { type } = (config || {}) as ShowcaseConfig;
  if (!reviews) {
    return null;
  }

  return (
    <>
      {type === 'flow' && (
        <FlowLayoutServer items={reviews} config={config} />
      )}
      {type === 'grid' && (
        <GridLayout items={reviews} config={config} />
      )}
      {type === 'list' && (
        <ListLayoutServer items={reviews} config={config} />
      )}
      {type === 'single-carousel' && (
        <SingleCarouselLayout items={reviews} config={config} />
      )}
      {type === 'multi-carousel' && (
        <MultiCarouselLayout items={reviews} config={config} />
      )}
      {type === 'avatar-list' && (
        <AvatarListLayout items={reviews} config={config} />
      )}
      {type === 'fix-row' && <FixRowLayout items={reviews} config={config} />}
    </>
  );
}
