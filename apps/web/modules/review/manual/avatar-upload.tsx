'use client';
import { Button } from '@/components/ui/button';
import React, { useRef } from 'react';
import { BiUser } from 'react-icons/bi';
import { useUploadS3 } from '@/hooks/use-upload-s3';

export default function AvatarUpload(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, status, error } = useUploadS3();

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
      props.onChange(url);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
        {props.value ? (
          <img
            src={props.value}
            alt="Profile"
            className="w-10 h-10 object-cover rounded-full"
          />
        ) : (
          <BiUser className="text-2xl" />
        )}
      </div>
      <Button
        type="button"
        variant={'outline'}
        onClick={handlePickImage}
        disabled={status === 'uploading'}
      >
        {status === 'uploading' ? 'Uploading...' : 'Pick an image'}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
