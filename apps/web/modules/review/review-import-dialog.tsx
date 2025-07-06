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
import React, { useEffect, useState } from 'react';
import { BiDownload, BiPlus, BiX } from 'react-icons/bi';
import ReviewImportManualDialog from './manual';
import ReviewImportXDialog from './twitter';
import {
  BsFacebook,
  BsGoogle,
  BsLinkedin,
  BsTwitterX,
  BsTiktok,
} from 'react-icons/bs';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/UserProvider';
import { Tweet } from 'react-tweet/api';
import { parseTweet } from '@/lib/utils';
import ReviewImportTiktokDialog from './tiktok';
import { TiktokOembedResponse } from '@reviewsup/api/tiktok';
import ReviewImportGoogleMapDialog from '@/modules/review/google';
import ImportLinkedInDialog from './linkedin';

export default function ReviewImportDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { defaultWorkspace, user, signIn } = useUserContext();

  /**
   * 将tweet数据转换成 review数据，然后发送给服务端， 服务端不需要做任何转换
   * @param tweetId
   * @param data
   */
  const importFromX = async (
    tweetId: string,
    data: Tweet | undefined | null,
  ) => {
    try {
      if (!tweetId || !data || !defaultWorkspace) {
        toast.error('Tweet ID is missing');
        return;
      }
      const parseData = parseTweet(data);
      await api.review.createReview({
        workspaceId: defaultWorkspace.id,
        rating: 5,
        message: parseData?.message,
        fullName: parseData?.fullName,
        email: parseData?.email,
        avatarUrl: parseData?.avatarUrl,
        imageUrls: parseData?.imageUrls,
        videoUrl: parseData?.videoUrl,
        tweetId: parseData?.tweetId,
        reviewerId: user?.id || '',
        source: 'twitter',
        sourceUrl: parseData?.tweetUrl,
        userUrl: parseData?.userUrl,
        title: `@${parseData?.screen_name}`,
      });
      toast.success('Review created successfully!');
      setIsOpen(false);
    } catch (error) {
      toast('Failed to create review. Please try again.');
      return;
    }
  };

  const importFromTiktok = async (data: TiktokOembedResponse | undefined) => {
    try {
      if (!data || !defaultWorkspace) {
        toast.error('Tweet ID is missing');
        return;
      }
      await api.review.createReview({
        workspaceId: defaultWorkspace.id,
        rating: 5,
        message: data.title,
        fullName: data.author_name,
        imageUrls: [data.thumbnail_url || ''],
        reviewerId: user?.id || '',
        source: 'tiktok',
        sourceUrl: data.url,
        userUrl: data.author_url,
        title: data.author_url?.replace('https://www.tiktok.com/@', '@') || '',
        extra: {
          ...data,
        },
      });
      toast.success('Review created successfully!');
      setIsOpen(false);
    } catch (error) {
      toast('Failed to create review. Please try again.');
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'}>
          <BiPlus className="text-2xl" />
          Import Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Import Reviews</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <label>Import Reviews from Third Platform</label>
          <div className="grid grid-cols-4 gap-2">
            <ReviewImportXDialog
              onImport={(tweetId, data) => {
                importFromX(tweetId, data);
              }}
            >
              <Button
                size={'lg'}
                className="w-full items-center justify-center text-sm"
                variant={'outline'}
              >
                <BsTwitterX />
                Twitter/X
              </Button>
            </ReviewImportXDialog>
            <ReviewImportTiktokDialog
              onImport={(data) => {
                importFromTiktok(data);
              }}
            >
              <Button
                size={'lg'}
                className="w-full items-center justify-center text-sm"
                variant={'outline'}
              >
                <BsTiktok />
                TikTok
              </Button>
            </ReviewImportTiktokDialog>
            <ReviewImportGoogleMapDialog
              onImport={async (place) => {
                if (!defaultWorkspace) {
                  toast.error('Please select a workspace first.');
                  return;
                }
                if (!place || !place.reviews || place.reviews.length === 0) {
                  toast.error('No reviews found for this place.');
                  return;
                }
                const results = await Promise.all(
                  place.reviews.map((review) => {
                    return api.review.createReview({
                      workspaceId: defaultWorkspace.id,
                      reviewerId: user?.id || '',
                      rating: review.rating,
                      message: review.text?.text,
                      fullName: review.authorAttribution?.displayName,
                      email: '',
                      avatarUrl: review.authorAttribution?.photoUri,
                      userUrl: review.authorAttribution?.uri,
                      imageUrls: [],
                      videoUrl: '',
                      source: 'google',
                      sourceUrl: review.googleMapsUri || place.googleMapsUri,
                      title: '',
                      extra: {
                        ...review,
                      },
                    });
                  }),
                );
                if (results && results.length > 0) {
                  toast.success('Reviews imported successfully!');
                  setIsOpen(false);
                } else {
                  toast.error('Failed to import reviews.');
                }
              }}
            >
              <Button
                size={'lg'}
                className="w-full items-center justify-center text-sm"
                variant={'outline'}
              >
                <BsGoogle />
                Google
              </Button>
            </ReviewImportGoogleMapDialog>
            <ImportLinkedInDialog
              onImport={(linkedinEmbedCode) => {
                if (!defaultWorkspace) {
                  toast.error('Please select a workspace first.');
                  return;
                }
                if (!linkedinEmbedCode) {
                  toast.error('LinkedIn embed code is required.');
                  return;
                }
                api.review
                  .createReview({
                    workspaceId: defaultWorkspace.id,
                    reviewerId: user?.id || '',
                    rating: 5,
                    message: 'message from LinkedIn',
                    fullName: 'LinkedIn User',
                    email: '',
                    avatarUrl: '',
                    userUrl: '',
                    imageUrls: [],
                    videoUrl: '',
                    source: 'linkedin',
                    sourceUrl: linkedinEmbedCode.src,
                    extra: {
                      ...linkedinEmbedCode
                    },
                  })
                  .then(() => {
                    toast.success('Review imported successfully!');
                    setIsOpen(false);
                  })
                  .catch((error) => {
                    console.error('Error importing LinkedIn review:', error);
                    toast.error('Failed to import LinkedIn review.');
                  });
              }}
            >
              <Button
                size={'lg'}
                className="w-full items-center justify-center text-sm"
                variant={'outline'}
              >
                <BsLinkedin />
                LinkedIn
              </Button>
            </ImportLinkedInDialog>
            <Button
              size={'lg'}
              className="w-full items-center justify-center text-sm"
              variant={'outline'}
            >
              <BsFacebook />
              Facebook
            </Button>
          </div>

          {/* or */}
          <div className="flex items-center justify-center">
            <hr className="w-full border-t border-gray-300" />
            <span className="text-gray-500">or</span>
            <hr className="w-full border-t border-gray-300" />
          </div>
          <label>Add Review Manually</label>
          <ReviewImportManualDialog />
        </div>
      </DialogContent>
    </Dialog>
  );
}
