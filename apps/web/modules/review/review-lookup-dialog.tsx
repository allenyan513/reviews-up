import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { ReviewEntity } from '@repo/api/reviews';
import { ReviewItem } from '@reviewsup/embed-react';

export default function ReviewLookupDialog(props: {
  review: ReviewEntity | null;
  children: React.ReactNode;
}) {
  const { review, children } = props;
  if (!review) {
    return null;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-5/6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            View the details of the selected review.
          </DialogDescription>
        </DialogHeader>
        <ReviewItem review={review} />
      </DialogContent>
    </Dialog>
  );
}
