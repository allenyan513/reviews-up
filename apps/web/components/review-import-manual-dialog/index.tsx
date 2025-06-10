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

import AvatarUpload from '@/components/review-import-manual-dialog/avatar-upload';
import StarRating from '@/components/review-import-manual-dialog/star-rating';
import DataPicker from '@/components/review-import-manual-dialog/data-picker';

export default function ReviewImportManualDialog(props: {
  onOpenCallback?: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { defaultWorkspace } = useUserContext();
  const [formData, setFormData] = useState({
    workspaceId: defaultWorkspace?.id || '',
    fullName: '',
    email: '',
    tagline: '',
    link: '',
    rating: 0,
    profilePicture: '',
    message: '',
    source: 'manual',
    date: new Date(),
  });

  const [addStatus, setAddStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [addError, setAddError] = useState<string | null>(null);

  const createReview = async () => {
    console.log(formData);
    try {
      setAddStatus('loading');
      const res = await api.submitReview(
        {
          workspaceId: formData.workspaceId,
          fullName: formData.fullName,
          email: formData.email,
          rating: formData.rating,
          message: formData.message,
          imageUrls: [],
          videoUrl: '',
          tweetId: '',
        },
        {
          session: session,
        },
      );
      toast.success('Review created successfully!');
      setAddStatus('success');
      setIsOpen(false);
    } catch (error) {
      setAddError('Failed to create review. Please try again.');
      setAddStatus('error');
      return;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        props.onOpenCallback?.(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-start"
          variant="outline"
        >
          <BiDownload />
          Manual Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Let's import some reviews ✌🏻</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-4xl font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="John Smith"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="tagline"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Tagline
              </label>
              <input
                type="text"
                id="tagline"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="e.g. Co-founder & CTO at Shapo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g. john@shapo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="link"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Link
              </label>
              <input
                type="url"
                id="link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://reviews.com/review/123"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Rating
              </label>
              <StarRating
                value={formData.rating}
                onChange={(value) => {
                  setFormData({ ...formData, rating: value });
                }}
              />
            </div>
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Profile picture
              </label>
              <AvatarUpload
                value={formData.profilePicture}
                onChange={(value) => {
                  setFormData({ ...formData, profilePicture: value });
                }}
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={5}
              placeholder="Love this service! If you have customers that need a level of confidence before they buy, this will help a ton!"
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="mb-8">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Date
            </label>
            <DataPicker
              value={formData.date}
              onChange={(date) => {
                setFormData({ ...formData, date: date || new Date() });
              }}
            />
          </div>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={createReview} className="ml-2">
            Add Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
