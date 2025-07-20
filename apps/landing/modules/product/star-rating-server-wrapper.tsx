'use client';
import { StarRatingServer } from '@reviewsup/embed-react';

export function StarRatingServerWrapper(props: { value: number }) {
  return <StarRatingServer size={'sm'} value={props.value} />;
}
