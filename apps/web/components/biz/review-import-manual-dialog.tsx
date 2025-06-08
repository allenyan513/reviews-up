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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserContext } from '@/context/UserProvider';
import React, { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';
import { BiDownload, BiX } from 'react-icons/bi';

export default function ReviewImportManualDialog() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, defaultWorkspace } = useUserContext();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    tagline: '',
    link: '',
    rating: 0,
    profilePicture: null,
    message: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  })

  const createReview = () => {
    // api
    //   .createReview(
    //     {
    //       workspaceId: defaultWorkspace?.id || '',
    //       reviewerName: formData.fullName,
    //       reviewerEmail: formData.email,
    //       // reviewerImage: formData.profilePicture,
    //       rating: formData.rating,
    //       text: formData.message,
    //     },
    //     {
    //       session: session,
    //     },
    //   )
    //   .then((response) => {
    //     console.log('Workspace created:', response);
    //     setIsOpen(false);
    //   })
    //   .catch((error) => {
    //     console.error('Error creating workspace:', error);
    //   });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Profile picture
              </label>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Pick an image
                </button>
              </div>
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
              placeholder="Love this service! If you have customers that need a level of confidence before they buy, this will help a ton!"
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <p className="text-right text-sm text-blue-600 mt-2">
              <span className="inline-flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 18H5a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-5m-9 0H3m6 0h6m-9-4h.01M16 6l-4 4 4 4"
                  ></path>
                </svg>
                You can highlight part of the text by selecting it.
              </span>
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Attach up to 3 images
            </label>
            <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-400 text-sm">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/*<div className="mb-6">*/}
          {/*  <label*/}
          {/*    htmlFor="addRelatedTags"*/}
          {/*    className="block text-gray-700 text-sm font-medium mb-1"*/}
          {/*  >*/}
          {/*    Add related tags{' '}*/}
          {/*    <span className="text-gray-400 text-xs">(?)</span>*/}
          {/*  </label>*/}
          {/*  <input*/}
          {/*    type="text"*/}
          {/*    id="addRelatedTags"*/}
          {/*    placeholder="Type tag name..."*/}
          {/*    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="mb-8">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              defaultValue="2025-06-07"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/*<button*/}
          {/*  type="submit"*/}
          {/*  className="w-full bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"*/}
          {/*>*/}
          {/*  Add Testimonial*/}
          {/*</button>*/}
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          {/*<Button type="submit" onClick={createWorkspace} className="ml-2">*/}
          {/*  Add Review*/}
          {/*</Button>*/}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
