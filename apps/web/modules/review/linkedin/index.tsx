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
import Link from 'next/link';
import { LinkedinEmbedCode } from '@reviewsup/api/linkedin';
import { LinkedinEmbed, ReviewItemSource } from '@reviewsup/embed-react';
import { api } from '@/lib/api-client';
import { useSession } from '@/context/UserProvider';

export function ImportLinkedInDialog(props: {
  workspaceId: string;
  formId: string | undefined;
  onImportStart?: () => void;
  onImportSuccess?: () => void;
  onImportFailed?: (error: Error) => void;
}) {
  const { user } = useSession();
  const {
    workspaceId,
    formId,
    onImportStart,
    onImportSuccess,
    onImportFailed,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [linkedinEmbedCode, setLinkedInEmbedCode] = useState<
    LinkedinEmbedCode | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const submitReview = async () => {
    try {
      if (!workspaceId || !linkedinEmbedCode) {
        throw new Error('No tiktok url provided');
      }
      if (onImportStart) {
        onImportStart();
      }
      await api.review.createReview(
        {
          workspaceId: workspaceId,
          formId: formId,
          rating: 5,
          message: 'message from LinkedIn',
          fullName: 'LinkedIn User',
          email: undefined,
          avatarUrl: undefined,
          userUrl: undefined,
          imageUrls: [],
          videoUrl: undefined,
          source: 'linkedin',
          sourceUrl: linkedinEmbedCode.src,
          extra: {
            ...linkedinEmbedCode,
          },
        },
        user,
      );
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      if (onImportFailed) {
        onImportFailed(error as Error);
      }
    }
  };

  /**
   * <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7344111479064850435?collapsed=1" height="551" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
   */
  useEffect(() => {
    if (!inputValue) {
      return;
    }
    if (
      !inputValue.match(
        /<iframe\s+[^>]*src=["']https:\/\/www\.linkedin\.com\/embed[^"']*["'][^>]*><\/iframe>/i,
      )
    ) {
      setError('Invalid LinkedIn embed code format');
      setLinkedInEmbedCode(undefined);
      return;
    }
    //使用正则表达式验证输入的LinkedIn嵌入代码， 解析出src height width等信息
    setLoading(true);
    const srcMatch = inputValue.match(/src=["']([^"']+)["']/i);
    const heightMatch = inputValue.match(/height=["'](\d+)["']/i);
    const widthMatch = inputValue.match(/width=["'](\d+)["']/i);
    if (!srcMatch || !heightMatch || !widthMatch) {
      setError('Invalid LinkedIn embed code format');
      setLoading(false);
      setLinkedInEmbedCode(undefined);
      return;
    }
    const src = srcMatch[1];
    const height = parseInt(heightMatch[1] || '0', 10);
    const width = parseInt(widthMatch[1] || '0', 10);
    setError(null);
    setLinkedInEmbedCode({
      originCode: inputValue,
      src,
      height,
      width,
    });
  }, [inputValue]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setInputValue('');
          setLinkedInEmbedCode(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-center text-sm"
          variant={'outline'}
        >
          <ReviewItemSource clickable={false} source={'linkedin'} />
          LinkedIn
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-2xl overflow-x-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Import from LinkedIn</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-w-4xl font-sans flex flex-col w-full items-center">
          <div className="mb-4 w-full text-start">
            <label
              htmlFor="google map"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              LinkedIn Embed Code:
              <Link
                href="https://docs.reviewsup.io/docs/how-to/get-embed-code/linkedin"
                target="_blank"
                className="text-blue-500 hover:underline ml-2"
              >
                How to get embed code?
              </Link>
            </label>
            <textarea
              id="textquery"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              placeholder="Enter a name or address to search in Google Maps"
              className="w-full max-w-4xl h-36 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && (
              <span className="text-red-500 text-sm mt-2">{error}</span>
            )}
          </div>
          {linkedinEmbedCode && (
            <LinkedinEmbed linkedinEmbedCode={linkedinEmbedCode} />
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
            disabled={!linkedinEmbedCode}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
