'use client';
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
import React, { useState, useRef, useEffect } from 'react';

import { Tweet, useTweet } from 'react-tweet';
import { parseTweet } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { ReviewItemSource } from '@reviewsup/embed-react';
import Link from 'next/link';
import { useSession } from '@/context/UserProvider';

export function ReviewImportXDialog(props: {
  workspaceId: string;
  formId: string | undefined;
  onImportStart?: () => void;
  onImportSuccess?: () => void;
  onImportFailed?: (error: Error) => void;
}) {
  const { user } = useSession();
  const { workspaceId,formId, onImportSuccess, onImportFailed, onImportStart } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tweetId, setTweetId] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const { data } = useTweet(tweetId);

  useEffect(() => {
    if (!inputValue) {
      return;
    }
    if (inputValue.match(/https:\/\/x\.com\/\w+\/status\/\d+/)) {
      const tweetId = inputValue.match(/status\/(\d+)/)?.[1] || null;
      setTweetId(tweetId || '');
    } else {
      setTweetId('');
    }
  }, [inputValue]);

  const submitReviews = async () => {
    try {
      if (!workspaceId || !data) {
        throw new Error('Workspace ID or tweet data is missing');
      }
      if (onImportStart) {
        onImportStart();
      }
      const parseData = parseTweet(data);
      await api.review.createReview(
        {
          workspaceId: workspaceId,
          formId: formId,
          rating: 5,
          message: parseData?.message,
          fullName: parseData?.fullName,
          email: parseData?.email,
          avatarUrl: parseData?.avatarUrl,
          imageUrls: parseData?.imageUrls,
          videoUrl: parseData?.videoUrl,
          tweetId: parseData?.tweetId,
          reviewerId: '',
          source: 'twitter',
          sourceUrl: parseData?.tweetUrl,
          userUrl: parseData?.userUrl,
          title: `@${parseData?.screen_name}`,
        },
        user,
      );
      setIsOpen(false);
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      if (onImportFailed) {
        onImportFailed(error as Error);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setInputValue('');
          setTweetId('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-center text-sm"
          variant={'outline'}
        >
          <ReviewItemSource source={'twitter'} clickable={false} />
          Twitter/X
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-2xl overflow-x-scroll max-h-screen">
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
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Twitter/X URL:
              <Link
                href="https://docs.reviewsup.io/docs/how-to/get-embed-code/twitter"
                target="_blank"
                className="text-blue-500 hover:underline ml-2"
              >
                How to get Twitter/X URL?
              </Link>
            </label>
            <textarea
              id="tweetUrl"
              value={inputValue}
              rows={3}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              placeholder="https://x.com/username/status/1234567890123456789"
              className="w-full max-w-4xl p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            onClick={submitReviews}
            className="ml-2"
            disabled={!tweetId}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
