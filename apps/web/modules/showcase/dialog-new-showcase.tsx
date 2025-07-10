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
import toast from 'react-hot-toast';
import { useShowcaseContext } from '@/modules/showcase/context/showcase-context';

export default function DialogNewShowcase(props: {}) {
  const { defaultWorkspace } = useUserContext();
  const { createShowcase } = useShowcaseContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<{
    name: string;
  }>({
    name: '',
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'}>
          <BiPlus className="text-2xl" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Widget</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-8">
          <Label htmlFor="workspace-name">Widget Name</Label>
          <Input
            id="showcase-name"
            placeholder="e.g. New Widget"
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
          <Button
            type="submit"
            onClick={async () => {
              if (!defaultWorkspace || !defaultWorkspace.id) {
                toast.error('Please select a workspace first.');
                return;
              }
              await createShowcase(defaultWorkspace.id, submitForm.name);
              setSubmitForm({
                name: '',
              });
              setIsOpen(false);
            }}
            className="ml-2"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
