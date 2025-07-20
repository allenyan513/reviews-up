'use client';

import { FlowLayoutServer } from './layout/flow-layout-server';
import { ListLayoutServer } from './layout/list-layout-server';
import { CarouselLayout } from './layout/carousel-layout';
import { AvatarListLayout } from './layout/avatar-list-layout';
import { WidgetConfig, WidgetEntity } from '@reviewsup/api/widgets';
import { GridLayout } from './layout/grid-layout';
import { Badge } from './layout/badge.server';
import styled from 'styled-components';

const RootDiv = styled.div`
  font-family: sans-serif;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: black;

  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }

  strong {
    font-weight: bolder;
  }

  img,
  video {
    max-width: 100%;
    height: auto;
  }

  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  p {
    margin: 0;
  }
`;

export function WidgetContent(props: {
  widget: WidgetEntity;
  widgetConfig?: WidgetConfig;
}) {
  const { widget, widgetConfig } = props;
  const { reviews, config } = widget;
  const defaultConfig = widgetConfig || (config as WidgetConfig);
  if (!defaultConfig) {
    return null;
  }
  const { type } = defaultConfig;
  if (!reviews) {
    return null;
  }
  // const url = `https://app.reviewsup.io/widgets/${widget.shortId}`;
  const url = `http://localhost:5520/products/${widget.productId}`;
  return (
    <RootDiv>
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
      {type === 'badge' && (
        <Badge items={reviews} config={defaultConfig} url={url} />
      )}
    </RootDiv>
  );
}
