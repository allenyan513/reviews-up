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
import toast from 'react-hot-toast';
import { TiktokOembedResponse } from '@reviewsup/api/tiktok';
import { api } from '@/lib/api-client';
import { ReviewItemSource, TikTokEmbed } from '@reviewsup/embed-react';
import Link from 'next/link';
import { useSession } from '@/context/UserProvider';

export function ReviewImportTiktokDialog(props: {
  productId: string;
  formId: string | undefined;
  onImportStart?: () => void;
  onImportSuccess?: () => void;
  onImportFailed?: (error: Error) => void;
}) {
  const { user } = useSession();
  const {
    productId,
    formId,
    onImportStart,
    onImportSuccess,
    onImportFailed,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tiktokUrl, setTiktokUrl] = useState<string>('');
  const [tiktokResponse, setTiktokResponse] = useState<
    TiktokOembedResponse | undefined
  >();

  const submitReview = async () => {
    try {
      if (!productId || !tiktokResponse) {
        throw new Error('No tiktok url provided');
      }
      if (onImportStart) {
        onImportStart();
      }
      await api.review.createReview(
        {
          productId: productId,
          formId: formId,
          rating: 5,
          message: tiktokResponse.title,
          fullName: tiktokResponse.author_name,
          imageUrls: [tiktokResponse.thumbnail_url || ''],
          source: 'tiktok',
          sourceUrl: tiktokResponse.url,
          userUrl: tiktokResponse.author_url,
          title:
            tiktokResponse.author_url?.replace(
              'https://www.tiktok.com/@',
              '@',
            ) || '',
          extra: {
            ...tiktokResponse,
          },
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

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        if (!open) {
          setTiktokUrl('');
          setTiktokResponse(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-center text-sm"
          variant={'outline'}
        >
          <ReviewItemSource clickable={false} source={'tiktok'} />
          TikTok
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-2xl overflow-x-scroll max-h-screen">
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
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Tiktok URL:
              <Link
                href="https://docs.reviewsup.io/docs/how-to/get-embed-code/tiktok"
                target="_blank"
                className="text-blue-500 hover:underline ml-2"
              >
                How to get TikTok URL?
              </Link>
            </label>
            <textarea
              id="tiktokUrl"
              rows={3}
              value={tiktokUrl}
              onChange={onChange}
              placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
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
            onClick={submitReview}
            className="ml-2"
            disabled={!tiktokResponse}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
