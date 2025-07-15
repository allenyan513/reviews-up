'use client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { api } from '@/lib/api-client';
import { useSession, useUserContext } from '@/context/UserProvider';
import { CreateReviewDto } from '@reviewsup/api/reviews';
import { ManualImportView } from './manual-import-view';

export default function ReviewImportManualDialog(props: {}) {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { defaultProduct } = useUserContext();
  const [formData, setFormData] = useState<CreateReviewDto | undefined>(
    undefined,
  );

  const createReview = async () => {
    try {
      if (!formData) {
        return;
      }
      await api.review.createReview(
        {
          productId: defaultProduct?.id || '',
          ...formData,
        },
        user,
      );
      toast.success('Review created successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error(
        'Failed to create review. Please check your input and try again.',
      );
      return;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setFormData(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-center text-sm"
          variant="default"
        >
          <BiPlus /> Manual Import
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full min-w-2xl max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <ManualImportView formData={formData} setFormData={setFormData} />
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={createReview} className="ml-2">
            Add Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
