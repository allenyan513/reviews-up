import { FlowLayoutServer } from './layout/flow-layout-server';
import { ListLayoutServer } from './layout/list-layout-server';
import { CarouselLayout } from './layout/carousel-layout';
import { AvatarListLayout } from './layout/avatar-list-layout';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
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
      {type === 'carousel' && (
        <CarouselLayout items={reviews} config={defaultConfig} />
      )}
      {type === 'avatar-list' && (
        <AvatarListLayout items={reviews} config={defaultConfig} />
      )}
      {type === 'list' && (
        <ListLayoutServer items={reviews} config={defaultConfig} />
      )}
    </div>
  );
}
