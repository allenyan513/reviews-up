import React, { useState } from 'react';
import { StarRating } from '@reviewsup/embed-react';
import { Label } from '@reviewsup/ui/label';
import { Input } from '@reviewsup/ui/input';
import AvatarUpload from './avatar-upload';
import { UploadContainer } from '@/components/upload-container';
import { BiImage, BiVideo } from 'react-icons/bi';
import { CreateReviewDto } from '@reviewsup/api/reviews';

export function ManualImportView(props: {
  formData: CreateReviewDto | undefined;
  setFormData: React.Dispatch<
    React.SetStateAction<CreateReviewDto | undefined>
  >;
}) {
  const { formData, setFormData } = props;
  return (
    <div className="w-full flex flex-col gap-4 justify-center items-center ">
      <StarRating
        className=""
        size={'lg'}
        value={formData?.rating || 0}
        onChange={(value) => {
          setFormData({ ...formData, rating: value });
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
            placeholder="Enter your full name"
            value={formData?.fullName || ''}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
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
            value={formData?.email || ''}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter your email"
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
            value={formData?.title || ''}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g. Productmanager at Acme Corp"
          />
        </div>
        <div>
          <label
            htmlFor="link"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Profile Link
          </label>
          <Input
            type="url"
            id="link"
            value={formData?.userUrl || ''}
            onChange={(e) =>
              setFormData({ ...formData, userUrl: e.target.value })
            }
            placeholder="Enter your profile link"
          />
        </div>

        <div>
          <label
            htmlFor="Avatar"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Avatar
          </label>
          <AvatarUpload
            value={formData?.avatarUrl || ''}
            onChange={(value) => {
              setFormData({ ...formData, avatarUrl: value });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="w-full">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            value={formData?.message || ''}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={5}
            placeholder="Love this service! If you have customers that need a level of confidence before they buy, this will help a ton!"
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="flex flex-row justify-start w-full gap-2">
          {formData &&
            formData.imageUrls &&
            formData.imageUrls.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Uploaded image ${index + 1}`}
                className="w-24 h-24 object-cover rounded border border-gray-300"
              />
            ))}
        </div>
        {formData && formData.videoUrl && (
          <video
            src={formData.videoUrl}
            controls
            className="w-full rounded shadow-sm"
          />
        )}
        <div className="flex flex-row items-start w-full gap-2">
          <UploadContainer
            accept={'image/*'}
            onUploadSuccess={(url) => {
              setFormData((prev: any) => ({
                ...prev,
                imageUrls: [...(prev?.imageUrls || []), url],
              }));
            }}
          >
            <BiImage className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
          </UploadContainer>
          <UploadContainer
            accept={'video/*'}
            onUploadSuccess={(url) => {
              setFormData((prev) => ({
                ...prev,
                videoUrl: url,
              }));
            }}
          >
            <BiVideo className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
          </UploadContainer>
        </div>
      </div>
    </div>
  );
}
