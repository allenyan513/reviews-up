'use client';
import {Button} from '@/components/ui/button';
import {Input} from '@repo/ui/input';
import {Label} from '@repo/ui/label';
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
import StarRating from '@repo/ui/star-rating';

import React, {useState, useRef} from 'react';
import {BiDownload, BiPlus, BiUser, BiX} from 'react-icons/bi';
import {api} from '@/lib/api-client';
import {useUserContext} from '@/context/UserProvider';
import AvatarUpload from '@/modules/review/manual/avatar-upload';
import {CreateReviewDto} from "@repo/api/reviews/dto/create-review.dto";

export default function ReviewImportManualDialog(props: {

}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {defaultWorkspace} = useUserContext();
  const [formData, setFormData] = useState<CreateReviewDto>({
    workspaceId: defaultWorkspace?.id || '',
    rating: 0,
    message: '',
    fullName: '',
    email: '',
    userUrl: '',
    avatarUrl: '',
    imageUrls: [],
    videoUrl: '',
    title: '',
    source: 'manual',
  });

  const createReview = async () => {
    try {
      await api.review.createReview(formData);
      toast.success('Review created successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to create review. Please check your input and try again.');
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) =>{
      setIsOpen(open);
      if (!open) {
        setFormData({
          workspaceId: defaultWorkspace?.id || '',
          rating: 0,
          message: '',
          fullName: '',
          email: '',
          userUrl: '',
          avatarUrl: '',
          imageUrls: [],
          videoUrl: '',
          title: '',
          source: 'manual',
        });
      }
    }}>
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-center text-sm"
          variant="default">
          <BiPlus/> Manual Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <StarRating
            className=''
            size={'lg'}
            value={formData.rating || 0}
            onChange={(value) => {
              setFormData({...formData, rating: value});
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <Label
                htmlFor="fullName"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Full name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({...formData, fullName: e.target.value})
                }
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({...formData, email: e.target.value})
                }
                placeholder="e.g. john@reviewsup.io"
              />
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Title
              </label>
              <Input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({...formData, title: e.target.value})
                }
                placeholder="e.g. Co-founder & CTO"
              />
            </div>
            <div>
              <label
                htmlFor="link"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Link
              </label>
              <Input
                type="url"
                id="link"
                value={formData.userUrl}
                onChange={(e) =>
                  setFormData({...formData, userUrl: e.target.value})
                }
                placeholder="https://reviews.com/review/123"
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
                value={formData.avatarUrl || ''}
                onChange={(value) => {
                  setFormData({...formData, avatarUrl: value});
                }}
              />
            </div>
          </div>
          <div className="w-full">
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
                setFormData({...formData, message: e.target.value})
              }
              rows={5}
              placeholder="Love this service! If you have customers that need a level of confidence before they buy, this will help a ton!"
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
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
