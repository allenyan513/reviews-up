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
import { BiSortAlt2 } from 'react-icons/bi';
import { useUserContext } from '@/context/UserProvider';
import WorkspaceAddButton from '@/components/biz/workspace-add-button';

export default function WorkspaceChangeButton(props: {}) {
  const { user, defaultWorkspace } = useUserContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row items-center justify-between border border-gray-300 rounded-lg p-4 mb-2 gap-1 hover:border-gray-500 cursor-pointer">
          <div className="flex flex-col gap-2">
            <p>{defaultWorkspace?.name}</p>
            <p className="text-xs text-gray-500">Change workspace</p>
          </div>
          <BiSortAlt2 className="text-2xl text-gray-500" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Workspace</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex  flex-col gap-2">
          {/*<p>Choose a workspace</p>*/}
          {user && user.Workspace && user.Workspace.length > 0 && (
            <div className="flex flex-col gap-2">
              {user.Workspace.map((workspace: Workspace) => (
                <div
                  key={workspace.id}
                  className="flex flex-row w-full justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-500 cursor-pointer"
                  onClick={() => {
                    // Handle workspace change logic here
                    console.log(`Switching to workspace: ${workspace.name}`);
                  }}
                >
                  <div className="">{workspace.name}</div>
                  <p>Current</p>
                </div>
              ))}
            </div>
          )}
          <WorkspaceAddButton/>
          {/*<p className='text-sm mt-4 cursor-pointer'>+ <span className='underline'>Creat a new workspace</span></p>*/}
        </div>
        {/*<DialogFooter className="sm:justify-start">*/}
        {/*  <DialogClose asChild>*/}
        {/*    <Button type="button" variant="secondary">*/}
        {/*      Close*/}
        {/*    </Button>*/}
        {/*  </DialogClose>*/}
        {/*</DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
}
