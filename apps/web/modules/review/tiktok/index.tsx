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
import { api } from '@/lib/api-client';

import { Input } from '@/components/ui/input';
import { YtDlpResponse } from '@repo/api/yt-dlp/yt-dlp-response.dto';
import toast from 'react-hot-toast';

export default function ReviewImportTiktokDialog(props: {
  onImport: (response: YtDlpResponse | undefined) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tiktokUrl, setTiktokUrl] = useState<string>('');
  const [ytDlpResponse, setYtDlpResponse] = useState<
    YtDlpResponse | undefined
  >();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setTiktokUrl(inputValue);
    api.review
      .parse({
        url: inputValue,
      })
      .then((response) => {
        if (response) {
          setYtDlpResponse(response);
        }
      })
      .catch((error) => {
        toast.error('Error parsing TikTok URL:', error);
      });
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
              Tiktok URL:
            </label>
            <Input
              id="tiktokUrl"
              value={tiktokUrl}
              onChange={onChange}
              placeholder="https://x.com/username/status/1234567890123456789"
            ></Input>
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
              props.onImport(ytDlpResponse);
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
