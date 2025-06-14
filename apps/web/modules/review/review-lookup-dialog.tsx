import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BiDownload, BiPlus, BiSortAlt2 } from 'react-icons/bi';
import { useUserContext } from '@/context/UserProvider';
import React, { useState } from 'react';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { ReviewItem } from '@/modules/showcase/review-item';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';

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
