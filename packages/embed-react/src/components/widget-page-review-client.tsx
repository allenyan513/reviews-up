'use client';

import { FlowLayoutServer } from './layout/flow-layout-server';
import { ListLayoutServer } from './layout/list-layout-server';
import { CarouselLayout } from './layout/carousel-layout';
import { AvatarListLayout } from './layout/avatar-list-layout';
import { WidgetConfig, WidgetEntity } from '@reviewsup/api/widgets';
import { GridLayout } from './layout/grid-layout';
import { Badge } from './layout/badge.server';

export function WidgetPageReviewClient(props: {
  widget: WidgetEntity;
  widgetConfig?: WidgetConfig;
  className?: string;
}) {
  const { widget, widgetConfig, className } = props;
  const { reviews, config } = widget;
  const defaultConfig = widgetConfig || (config as WidgetConfig);
  if (!defaultConfig) {
    return null;
  }
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
      {type === 'badge' && <Badge items={reviews} config={defaultConfig} />}
    </div>
  );
}
