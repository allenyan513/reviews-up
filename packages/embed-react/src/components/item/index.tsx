import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import { TikTokEmbed } from '../embed/tiktok-embed';
import { ReviewItem } from './review-item';
import React from 'react';
import { ReviewItem1 } from './review-item-1';
import { LinkedinEmbed } from '../embed/linkedin-embed';

export function renderItem(
  review: ReviewEntity,
  itemStyle: 'style' | 'style-1',
  config?: WidgetConfig,
  width?: string,
  height?: string,
) {
  if (review.source === 'tiktok') {
    return (
      <TikTokEmbed
        key={review.id}
        tiktokId={review.extra.embed_product_id}
        thumbnailWidth={review.extra.thumbnail_width}
        thumbnailHeight={review.extra.thumbnail_height}
        width={width}
        height={height}
      />
    );
  } else if (review.source === 'linkedin') {
    return (
      <LinkedinEmbed
        key={review.id}
        linkedinEmbedCode={{
          ...review.extra,
        }}
        width={width}
        height={height}
      />
    );
  } else {
    if (itemStyle === 'style') {
      return <ReviewItem key={review.id} review={review} config={config} />;
    } else if (itemStyle === 'style-1') {
      return (
        <ReviewItem1
          key={review.id}
          review={review}
          config={config}
          style={{
            width: width,
            height: height,
          }}
        />
      );
    } else {
      return null;
    }
  }
}
