'use client';
import React, { useRef } from 'react';
import { useUploadS3 } from '@/hooks/use-upload-s3';

export function UploadContainer(props: {
  accept: 'image/*' | 'video/*' | 'audio/*';
  onUploadSuccess: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
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
      props.onUploadSuccess(url);
    }
  };

  return (
    <div onClick={handlePickImage}>
      {props.children}
      <input
        ref={fileInputRef}
        type="file"
        accept={props.accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={props.disabled}
      />
    </div>
  );
}
