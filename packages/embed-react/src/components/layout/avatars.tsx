'use client';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { WidgetConfig } from '@reviewsup/api/widgets';
import React, { useState } from 'react';
import { PoweredBy } from '../powered-by';
import styled from 'styled-components';
import { MoreReviews } from '../more-reviews';

const RootDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: black;
`;

const AvatarRow = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling for iOS */
`;

const AvatarEmpty = styled.div<{ $idx: number; size: string }>`
  width: ${({ size }) =>
    size === 'md' ? '3rem' : size === 'lg' ? '4rem' : '2rem'};
  height: ${({ size }) =>
    size === 'md' ? '3rem' : size === 'lg' ? '4rem' : '2rem'};
  border-radius: 9999px; /* Full circle */
  border: 2px solid #ffffff; /* Border similar to Tailwind's */
  background-color: #e5e7eb; /* Tailwind's bg-gray-200 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: ${({ $idx }) => ($idx === 0 ? '0' : '-1rem')};
`;

const AvatarImage = styled.img<{ $idx: number; size: string }>`
  width: ${({ size }) =>
    size === 'md' ? '3rem' : size === 'lg' ? '4rem' : '2rem'};
  height: ${({ size }) =>
    size === 'md' ? '3rem' : size === 'lg' ? '4rem' : '2rem'};
  border-radius: 9999px; /* Full circle */
  object-fit: cover;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid #ffffff; /* Border similar to Tailwind's */
  margin-left: ${({ $idx }) => ($idx === 0 ? '0' : '-1rem')};
`;

/**
 * @param props
 * @constructor
 */
export function AvatarsLayout(props: {
  items: ReviewEntity[];
  config: WidgetConfig;
  url: string;
  reviewsCount: number;
}) {
  const { items, config, url, reviewsCount } = props;
  const avatarSize = config?.avatarSize ?? 'md';
  return (
    <RootDiv>
      <AvatarRow>
        {items.map((item, idx) => {
          if (!item.reviewerImage) {
            return (
              <AvatarEmpty $idx={idx} key={idx} size={avatarSize}>
                {/*<LinkDoFollow*/}
                {/*  href={item.reviewerUrl}*/}
                {/*  isDoFollow={config.isDoFollowEnabled}*/}
                {/*>*/}
                <span>
                  {item.reviewerName
                    ? item.reviewerName.charAt(0).toUpperCase()
                    : 'U'}
                </span>
                {/*</LinkDoFollow>*/}
              </AvatarEmpty>
            );
          } else {
            return (
              <AvatarImage
                $idx={idx}
                key={item.id}
                size={avatarSize}
                src={item.reviewerImage}
                alt={item.reviewerName}
              />
            );
          }
        })}
      </AvatarRow>
      {/*{config.isMoreViewsEnabled && (*/}
      {/*  <MoreReviews url={url} reviewsCount={reviewsCount} />*/}
      {/*)}*/}
      {/*{config.isPoweredByEnabled && <PoweredBy />}*/}
    </RootDiv>
  );
}
