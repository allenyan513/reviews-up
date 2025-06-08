'use client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
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
import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { BiDownload, BiUser, BiX } from 'react-icons/bi';
import { api } from '@/lib/apiClient';
import { useUserContext } from '@/context/UserProvider';

import { Input } from '../ui/input';
import { Tweet } from 'react-tweet';
import { useTweet } from 'react-tweet';

export default function ReviewImportXDialog(props: {}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { defaultWorkspace } = useUserContext();
  const [tweetId, setTweetId] = useState<string | null>(null);

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const { isLoading, data, error } = useTweet(tweetId || undefined);

  const createReview = async () => {
    try {
      if (!tweetId || !data) {
        toast.error('Tweet ID is missing');
        return;
      }
      setStatus('loading');
      await api.createReview(
        {
          workspaceId: defaultWorkspace?.id || '',
          reviewerName: data.user.name,
          reviewerImage: data.user.profile_image_url_https,
          reviewerEmail: '',
          rating: 5,
          text: data.text,
          tweetId: tweetId,
          source: 'twitter',
        },
        {
          session: session,
        },
      );
      toast.success('Review created successfully!');
      setStatus('success');
      setIsOpen(false);
    } catch (error) {
      toast('Failed to create review. Please try again.');
      setStatus('error');
      return;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setTweetId(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-start"
          variant="outline"
        >
          <BiDownload />X
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl overflow-x-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Import Review from X</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-4xl font-sans">
          <div className="mb-6">
            <label
              htmlFor="tweetUrl"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Tweet URL
            </label>
            <Input
              id="tweetUrl"
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.match(/https:\/\/x\.com\/\w+\/status\/\d+/)) {
                  const tweetId =
                    inputValue.match(/status\/(\d+)/)?.[1] || null;
                  setTweetId(tweetId);
                } else {
                  setTweetId(null);
                }
              }}
              placeholder="https://x.com/username/status/1234567890123456789"
            ></Input>
          </div>
          {/*preview*/}
          <div className="items-center justify-between">
            {tweetId && <Tweet id={tweetId} />}
          </div>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button size={'lg'} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            size={'lg'}
            type="submit"
            onClick={createReview}
            className="ml-2"
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
