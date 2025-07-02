import { FlowLayoutServer } from './layout/flow-layout-server';
import { ListLayoutServer } from './layout/list-layout-server';
import { MultiCarouselLayout } from './layout/multi-carousel-layout';
import { AvatarListLayout } from './layout/avatar-list-layout';
import { FixRowLayout } from './layout/fix-row-layout';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import { SingleCarouselLayout } from './layout/single-carousel-layout';
import { GridLayout } from './layout/grid-layout';

export function ShowcasePageReviewClient(props: {
  showcase: ShowcaseEntity;
  showcaseConfig?: ShowcaseConfig;
  className?: string;
}) {
  const { showcase, showcaseConfig, className } = props;
  const { reviews, config } = showcase;
  const defaultConfig = showcaseConfig || (config as ShowcaseConfig);
  const { type } = defaultConfig;
  if (!reviews) {
    return null;
  }
  return (
    <div className={className}>
      {type === 'flow' && (
        <FlowLayoutServer items={reviews} config={defaultConfig} />
      )}
      {type === 'grid' && <GridLayout items={reviews} config={defaultConfig} />}
      {type === 'list' && (
        <ListLayoutServer items={reviews} config={defaultConfig} />
      )}
      {type === 'single-carousel' && (
        <SingleCarouselLayout items={reviews} config={defaultConfig} />
      )}
      {type === 'multi-carousel' && (
        <MultiCarouselLayout items={reviews} config={defaultConfig} />
      )}
      {type === 'avatar-list' && (
        <AvatarListLayout items={reviews} config={defaultConfig} />
      )}
      {type === 'fix-row' && (
        <FixRowLayout items={reviews} config={defaultConfig} />
      )}
    </div>
  );
}
