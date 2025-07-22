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
import {
  CreateReviewDto,
  ReviewEntity,
  UpdateReviewDto,
} from '@reviewsup/api/reviews';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { ManualImportView } from '@/modules/review/manual/manual-import-view';
import { Button } from '@/components/ui/button';

export function ReviewEditDialog(props: {
  review: ReviewEntity;
  children: React.ReactNode;
}) {
  const { review, children } = props;
  let imageUrls: string[] = [];
  if (review && review.medias) {
    imageUrls = review.medias
      .filter((media) => media.type === 'image')
      .map((media) => media.url)
      .filter((url): url is string => Boolean(url)); // 过滤 undefined，类型缩窄
  }
  let videoUrl: string | undefined;
  if (review && review.medias) {
    const videoMedia = review.medias.find((media) => media.type === 'video');
    videoUrl = videoMedia ? videoMedia.url : undefined;
  }
  const [formData, setFormData] = useState<CreateReviewDto | undefined>({
    fullName: review.reviewerName,
    avatarUrl: review.reviewerImage,
    email: review.reviewerEmail,
    userUrl: review.reviewerUrl,
    title: review.reviewerTitle,
    rating: review.rating,
    message: review.text,
    imageUrls: imageUrls,
    videoUrl: videoUrl,
  });
  const update = async () => {
    try {
      if (!formData) {
        return;
      }
      await api.review.updateReview(review?.id || '', {
        fullName: formData.fullName,
        avatarUrl: formData.avatarUrl,
        email: formData.email,
        userUrl: formData.userUrl,
        title: formData.title,
        rating: formData.rating,
        message: formData.message,
        imageUrls: formData.imageUrls,
        videoUrl: formData.videoUrl,
      } as UpdateReviewDto);
      toast.success('Review created successfully!');
    } catch (error) {
      toast.error(
        'Failed to create review. Please check your input and try again.',
      );
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full min-w-2xl max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <ManualImportView formData={formData} setFormData={setFormData} />
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={update} className="ml-2">
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
