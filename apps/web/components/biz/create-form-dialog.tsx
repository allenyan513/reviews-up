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
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { BiPlus, BiSortAlt2 } from 'react-icons/bi';
import { useUserContext } from '@/context/UserProvider';
import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function CreateFormDialog(props: {}) {
  const { data: session } = useSession();
  const { user, defaultWorkspace } = useUserContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>('');

  const createForm = () => {
    if (!defaultWorkspace || !defaultWorkspace.id) {
      toast.error('Please select a workspace first.');
      return;
    }
    if (!session) {
      toast.error('You must be logged in to create a form.');
      return;
    }
    api
      .createForm(
        {
          workspaceId: defaultWorkspace?.id || '',
          name: formName,
        },
        {
          session: session,
        },
      )
      .then((response) => {
        setFormName('');
        setIsOpen(false);
        toast.success('Form created successfully!');
      })
      .catch((error) => {
        toast.error('Failed to create form. Please try again.');
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'}>
          <BiPlus className="text-2xl" />
          New Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Form</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-8">
          <Label htmlFor="workspace-name">Form Name</Label>
          <Input
            id="form-name"
            placeholder="e.g. My New Form"
            className="w-full"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={createForm} className="ml-2">
            Create Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
