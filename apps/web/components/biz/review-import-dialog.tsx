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
import React, { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';
import { BiDownload, BiX } from 'react-icons/bi';
import Index from '../review-import-manual-dialog';
import ReviewImportManualDialog from '../review-import-manual-dialog';
import ReviewImportXDialog from '@/components/review-x-dialog';

const imports = [
  {
    title: 'Manual Import',
    url: '/import/csv',
    icon: BiDownload,
    dialog: ReviewImportManualDialog
  },
  {
    title: 'X',
    url: '/import/json',
    icon: BiX,
    dialog: ReviewImportXDialog
  }
];

export default function ReviewImportDialog() {
  const { data: session } = useSession();
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const createWorkspace = () => {
    api
      .createWorkspace(
        {
          name: workspaceName,
        },
        {
          session: session,
        },
      )
      .then((response) => {
        console.log('Workspace created:', response);
        setWorkspaceName('');
        setIsOpen(false);
      })
      .catch((error) => {
        console.error('Error creating workspace:', error);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'}>
          <BiDownload className="text-2xl" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Let's import some reviews ✌🏻</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {imports.map((item) => (
            <item.dialog key={item.title} />
          ))}
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={createWorkspace} className="ml-2">
            Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
