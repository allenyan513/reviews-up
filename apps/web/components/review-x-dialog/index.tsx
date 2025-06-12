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
import React, { useState, useRef } from 'react';

import { Input } from '../ui/input';
import { Tweet } from 'react-tweet';

export default function ReviewImportXDialog(props: {
  onImport: (tweetId: string) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tweetId, setTweetId] = useState<string | null>(null);

  const handleTweetIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.match(/https:\/\/x\.com\/\w+\/status\/\d+/)) {
      const tweetId = inputValue.match(/status\/(\d+)/)?.[1] || null;
      setTweetId(tweetId);
    } else {
      setTweetId(null);
    }
  };
  // const createReview = async () => {
  //   try {
  //     if (!tweetId || !data) {
  //       toast.error('Tweet ID is missing');
  //       return;
  //     }
  //     await api.submitReview(
  //       {
  //         workspaceId: defaultWorkspace?.id || '',
  //         reviewerName: data.user.name,
  //         reviewerImage: data.user.profile_image_url_https,
  //         reviewerEmail: '',
  //         rating: 5,
  //         text: data.text,
  //         tweetId: tweetId,
  //         source: 'twitter',
  //       },
  //       {
  //       },
  //     );
  //     toast.success('Review created successfully!');
  //     setIsOpen(false);
  //   } catch (error) {
  //     toast('Failed to create review. Please try again.');
  //     return;
  //   }
  // };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {/*<Button*/}
        {/*  size={'lg'}*/}
        {/*  className="w-full items-center justify-start"*/}
        {/*  variant="outline"*/}
        {/*>*/}
        {/*  <BiDownload />X*/}
        {/*</Button>*/}
        {props.children}
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
              onChange={handleTweetIdChange}
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
            onClick={() => {
              props.onImport(tweetId || '');
              setIsOpen(false);
            }}
            className="ml-2"
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
