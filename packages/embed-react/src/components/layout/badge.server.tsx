import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import React from 'react';
import { StarServer } from '../star.server';
import styled from 'styled-components';

interface BadgeProps {
  items: ReviewEntity[];
  config?: WidgetConfig;
  url?: string;
}

const MainSpan = styled.span`
  font-size: 1rem;
  color: black;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;
const SubSpan = styled.span`
  font-size: 0.5rem;
  color: #6b7280;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
`;

export function Badge({ items, config, url }: BadgeProps) {
  const ratings = items.map((item) => item.rating || 0);
  const averageRating =
    ratings.reduce((acc, rating) => acc + rating, 0) / (ratings.length || 1);
  const averageRatingFixed = averageRating.toFixed(1);
  const totalReviews = ratings.length;
  return (
    <a
      href={url}
      target="_blank"
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
        gap: '0.5rem',
        padding: '0.2rem 0.5rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        backgroundColor: '#ffffff',
        color: 'black',
      }}
    >
      <img
        src="https://reviewsup.io/favicon.ico"
        alt="ReviewsUp Logo"
        style={{ width: '1.5rem', height: '1.5rem' }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <MainSpan>reviewsup.io</MainSpan>
        <SubSpan> Featured on</SubSpan>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.1rem',
          }}
        >
          <MainSpan>{averageRatingFixed}</MainSpan>
          <StarServer isActive={true} size={'sm'} />
        </div>

        <SubSpan>{totalReviews} reviews</SubSpan>
      </div>
    </a>
  );
}
