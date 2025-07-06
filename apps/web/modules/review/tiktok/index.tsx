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
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { TiktokOembedResponse } from '@reviewsup/api/tiktok';
import { api } from '@/lib/api-client';
import { TikTokEmbed } from '@reviewsup/embed-react';

export default function ReviewImportTiktokDialog(props: {
  children: React.ReactNode;
  onImport?: (data: TiktokOembedResponse | undefined) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tiktokUrl, setTiktokUrl] = useState<string>('');
  const [tiktokResponse, setTiktokResponse] = useState<
    TiktokOembedResponse | undefined
  >();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setTiktokUrl(inputValue);
    //check if the input is a valid TikTok URL
    if (!inputValue.match(/https:\/\/www\.tiktok\.com\/@[\w-]+\/video\/\d+/)) {
      setTiktokResponse(undefined);
      return;
    }
    api.review
      .parseTiktok({
        url: inputValue,
      })
      .then((response: TiktokOembedResponse) => {
        setTiktokResponse(response);
      })
      .catch((error) => {
        console.error('Error fetching TikTok data:', error);
        toast.error('Failed to fetch TikTok data');
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
          <DialogTitle>Import from Tiktok</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-4xl font-sans flex flex-col w-full items-center">
          <div className="mb-6 w-full text-start">
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
              placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
              className="w-full max-w-4xl"
            ></Input>
          </div>
          {tiktokResponse && (
            <TikTokEmbed
              tiktokId={tiktokResponse.embed_product_id || ''}
              thumbnailWidth={tiktokResponse.thumbnail_width || 0}
              thumbnailHeight={tiktokResponse.thumbnail_height || 0}
            />
          )}
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
              props.onImport?.(tiktokResponse);
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
