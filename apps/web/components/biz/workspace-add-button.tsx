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
import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function WorkspaceAddButton(props: {}) {
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
        setWorkspaceName('');
        setIsOpen(false);
        toast.success('Workspace created successfully!');
      })
      .catch((error) => {
        toast.error('Failed to create workspace. Please try again.');
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <p className="text-sm mt-4 cursor-pointer">
          + <span className="underline">Creat a new workspace</span>
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Workspace</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-8">
          <Label htmlFor="workspace-name">Workspace Name</Label>
          <Input
            id="workspace-name"
            placeholder="Enter workspace name"
            className="w-full"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
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
