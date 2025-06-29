'use client';
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
import React, {useState, useRef} from 'react';

import {Input} from '@/components/ui/input';
import {Tweet, useTweet} from 'react-tweet';
import {Tweet as TweetEntity} from 'react-tweet/api';

export default function ReviewImportXDialog(props: {
  onImport: (tweetId: string, data: TweetEntity | null | undefined) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tweetId, setTweetId] = useState<string | null>(null);
  const {data} = useTweet(tweetId || '');

  const handleTweetIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.match(/https:\/\/x\.com\/\w+\/status\/\d+/)) {
      const tweetId = inputValue.match(/status\/(\d+)/)?.[1] || null;
      setTweetId(tweetId);
    } else {
      setTweetId(null);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl overflow-x-scroll max-h-screen">
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
              X URL:
            </label>
            <Input
              id="tweetUrl"
              onChange={handleTweetIdChange}
              placeholder="https://x.com/username/status/1234567890123456789"
            ></Input>
          </div>
          {/*preview*/}
          <div className="items-center justify-between">
            {tweetId && <Tweet id={tweetId}/>}
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
              props.onImport(tweetId || '', data);
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
