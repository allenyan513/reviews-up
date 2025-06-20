import FlowLayoutServer from './layout/flow-layout-server';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import ListLayoutServer from './layout/list-layout-server';

export async function ShowcasePageReview(props: { showcase: ShowcaseEntity }) {
  const reviews = props.showcase.reviews;
  const config = props.showcase.config as ShowcaseConfig;
  const { type } = (config || {}) as ShowcaseConfig;
  if (!reviews) {
    return null;
  }

  return (
    <div>
      {type === 'flow' && <FlowLayoutServer items={reviews} config={config} />}
      {type === 'list' && <ListLayoutServer items={reviews} config={config} />}
    </div>
  );
}
