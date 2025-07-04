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
import { BsFacebook, BsGoogle, BsLinkedin, BsTwitterX } from 'react-icons/bs';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/UserProvider';
import { Tweet } from 'react-tweet/api';
import { parseTweet } from '@/lib/utils';
import { YtDlpResponse } from '@reviewsup/api/yt-dlp';

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
        userUrl: parseData?.userUrl,
        avatarUrl: parseData?.avatarUrl,
        source: 'twitter',
        imageUrls: parseData?.imageUrls,
        videoUrl: parseData?.videoUrl,
        tweetId: parseData?.tweetId,
        reviewerId: user?.id || '',
      });
      toast.success('Review created successfully!');
      setIsOpen(false);
    } catch (error) {
      toast('Failed to create review. Please try again.');
      return;
    }
  };

  const importFromTiktok = async (data: YtDlpResponse | undefined | null) => {
    try {
      if (!data || !defaultWorkspace) {
        toast.error('Tweet ID is missing');
        return;
      }
      await api.review.createReview({
        workspaceId: defaultWorkspace.id,
        rating: 5,
        message: data.title,
        fullName: data.title,
        email: '',
        userUrl: '',
        avatarUrl: '',
        source: 'manual',
        imageUrls: [data.thumbnail],
        videoUrl: data.video_url,
        tweetId: '',
        reviewerId: user?.id || '',
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
              <div>
                <Button
                  size={'lg'}
                  className="w-full items-center justify-center text-sm"
                  variant={'outline'}
                >
                  <BsTwitterX />
                  Twitter/X
                </Button>
              </div>
            </ReviewImportXDialog>
            <Button
              size={'lg'}
              className="w-full items-center justify-center text-sm"
              variant={'outline'}
            >
              <BsGoogle />
              Google
            </Button>
            <Button
              size={'lg'}
              className="w-full items-center justify-center text-sm"
              variant={'outline'}
            >
              <BsLinkedin />
              LinkedIn
            </Button>
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
