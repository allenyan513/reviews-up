import {Button} from '@/components/ui/button';
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
import React, {useEffect, useState} from 'react';
import {BiDownload, BiX} from 'react-icons/bi';
import ReviewImportManualDialog from './manual';
import ReviewImportXDialog from './twitter';
import {BsTwitterX} from 'react-icons/bs';
import {api} from '@/lib/api-client';
import toast from 'react-hot-toast';
import {useUserContext} from '@/context/UserProvider';
import {Tweet} from 'react-tweet/api';
import {parseTweet} from '@/lib/utils';
import ReviewImportTiktokDialog from './tiktok';
import {YtDlpResponse} from '@repo/api/yt-dlp/yt-dlp-response.dto';

export default function ReviewImportDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {defaultWorkspace, user, signIn} = useUserContext();

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
      const parseData = parseTweet(data)
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
        reviewerId: user?.id || ''
      });
      toast.success('Review created successfully!');
      setIsOpen(false);
    } catch (error) {
      toast('Failed to create review. Please try again.');
      return;
    }
  };

  const importFromTiktok = async (
    data: YtDlpResponse | undefined | null,
  ) => {
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
        reviewerId: user?.id || ''
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
          <BiDownload className="text-2xl"/>
          Import Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Let's import some reviews ✌🏻</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          {/*Import from x*/}
          <ReviewImportXDialog
            beforeOnOpenChange={() => {
              if (!user) {
                signIn()
                return false;
              }
              return true;
            }}
            onImport={(tweetId, data) => {
              importFromX(tweetId, data);
            }}
          >
            <div>
              <Button
                size={'lg'}
                className="w-full items-center justify-center text-lg"
              >
                <BsTwitterX className="text-xl"/>
                Import from X
              </Button>
            </div>
          </ReviewImportXDialog>
          {/*<ReviewImportTiktokDialog*/}
          {/*  onImport={(response: YtDlpResponse | undefined) => {*/}
          {/*    importFromTiktok(response);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <div>*/}
          {/*    <Button*/}
          {/*      size={'lg'}*/}
          {/*      className="w-full items-center justify-center text-lg"*/}
          {/*    >*/}
          {/*      <BsTwitterX className="text-xl"/>*/}
          {/*      Import from Tiktok*/}
          {/*    </Button>*/}
          {/*  </div>*/}
          {/*</ReviewImportTiktokDialog>*/}


          {/*Import from manual*/}
          <ReviewImportManualDialog/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
