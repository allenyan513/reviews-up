import React from 'react';

export function BadgeSvg(props: {
  averageRating: number;
  totalReviews: number;
  theme: 'light' | 'dark';
}) {
  const { averageRating, totalReviews, theme } = props;
  const bgColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#f9fafb' : '#111827';
  const textColorSecondary = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const base64 =
    'data:image/png;base64,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';

  return (
    <svg width="230" height="54" xmlns="http://www.w3.org/2000/svg">
      <rect
        width="100%"
        height="100%"
        fill={bgColor}
        stroke={'#e5e7eb'}
        rx="12"
      />
      <image
        href={base64}
        x="15"
        y="15"
        width="24"
        height="24"
      />
      <text
        x="48"
        y="22"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fill={textColor}
        fontWeight="bold"
      >
        reviewsup.io
      </text>
      <text
        x="48"
        y="40"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fill={textColorSecondary}
      >
        FEATURED ON
      </text>

      <text
        x="165"
        y="22"
        fontSize="16"
        fontFamily="Arial, sans-serif"
        fill={textColor}
        fontWeight="bold"
      >
        {averageRating.toFixed(1)}
      </text>
      <text x="190" y="21" fontSize="14" fill="#facc15">
        ★
      </text>
      <text
        x="150"
        y="40"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fill={textColorSecondary}
      >
        {totalReviews} REVIEWS
      </text>
    </svg>
  );
}
