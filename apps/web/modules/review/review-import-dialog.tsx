import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import ReviewImportManualDialog from './manual';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/UserProvider';
import { ReviewImportTiktokDialog } from './tiktok';
import { ReviewImportGoogleMapDialog } from '@/modules/review/google';
import { ReviewImportXDialog } from './twitter';
import { ImportLinkedInDialog } from './linkedin';

export default function ReviewImportDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { defaultProduct, user } = useUserContext();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'}>
          <BiPlus className="text-2xl" />
          Import Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Reviews</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 w-full">
          <label>Import Reviews from Third Platform</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <ReviewImportXDialog
              productId={defaultProduct?.id || ''}
              formId={undefined}
              onImportStart={() => {}}
              onImportSuccess={() => {
                toast.success('Twitter reviews imported successfully!');
                setIsOpen(false);
              }}
              onImportFailed={(error) => {
                toast.error('Failed to import Twitter reviews.');
              }}
            />
            <ReviewImportTiktokDialog
              productId={defaultProduct?.id || ''}
              formId={undefined}
              onImportStart={() => {}}
              onImportSuccess={() => {
                toast.success('TikTok reviews imported successfully!');
                setIsOpen(false);
              }}
              onImportFailed={(error) => {
                toast.error('Failed to import TikTok reviews.');
              }}
            ></ReviewImportTiktokDialog>
            <ReviewImportGoogleMapDialog
              productId={defaultProduct?.id || ''}
              formId={undefined}
              onImportStart={() => {}}
              onImportSuccess={() => {
                toast.success('TikTok reviews imported successfully!');
                setIsOpen(false);
              }}
              onImportFailed={(error) => {
                toast.error('Failed to import TikTok reviews.');
              }}
            />
            <ImportLinkedInDialog
              productId={defaultProduct?.id || ''}
              formId={undefined}
              onImportStart={() => {}}
              onImportSuccess={() => {
                toast.success('TikTok reviews imported successfully!');
                setIsOpen(false);
              }}
              onImportFailed={(error) => {
                toast.error('Failed to import TikTok reviews.');
              }}
            />
          </div>

          {/* or */}
          <div className="flex items-center justify-center">
            <hr className="w-full border-t border-gray-300" />
            <span className="text-gray-500">or</span>
            <hr className="w-full border-t border-gray-300" />
          </div>
          <label>Add Review Manually</label>
          <ReviewImportManualDialog />
        </div>
      </DialogContent>
    </Dialog>
  );
}
