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
import { BiPlus, BiSortAlt2 } from 'react-icons/bi';
import { useUserContext } from '@/context/UserProvider';
import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function DialogNewShowcase(props: {}) {
  const { data: session } = useSession();
  const { defaultWorkspace } = useUserContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<{
    name: string;
  }>({
    name: '',
  });

  const handleSubmit = () => {
    if (!defaultWorkspace || !defaultWorkspace.id) {
      toast.error('Please select a workspace first.');
      return;
    }
    if (!session) {
      toast.error('You must be logged in to create a form.');
      return;
    }
    api
      .createShowcase(
        {
          workspaceId: defaultWorkspace?.id || '',
          name: submitForm.name,
        },
        {
          session: session,
        },
      )
      .then((response) => {
        setSubmitForm({
          name: '',
        });
        setIsOpen(false);
        toast.success('Showcase created successfully!');
      })
      .catch((error) => {
        toast.error('Failed to create showcase. Please try again.');
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'}>
          <BiPlus className="text-2xl" />
          New Showcase
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Showcase</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-8">
          <Label htmlFor="workspace-name">Showcase Name</Label>
          <Input
            id="showcase-name"
            placeholder="e.g. My New Showcase"
            className="w-full"
            value={submitForm.name}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, name: e.target.value })
            }
          />
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} className="ml-2">
            Create Showcase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
