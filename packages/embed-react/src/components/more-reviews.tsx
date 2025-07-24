import styled from 'styled-components';

const MoreReviewsLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #9ca3af; /* Tailwind's text-gray-400 */
  text-decoration: none;
`;

export function MoreReviews(props: { url: string; reviewsCount: number }) {
  const { url, reviewsCount } = props;
  return (
    <MoreReviewsLink href={url} target="_blank">
      view all reviews ({reviewsCount})
    </MoreReviewsLink>
  );
}
