import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { BiSortAlt2 } from 'react-icons/bi';
import { useUserContext } from '@/context/UserProvider';
import { WorkspaceAddButton } from '@/modules/workspace/workspace-add-button';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function WorkspaceSwitchButton(props: {}) {
  const { user, defaultWorkspace, switchDefaultWorkspace } = useUserContext();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  className="flex flex-row w-full justify-between items-center p-6 border border-gray-300 rounded-lg hover:border-gray-500 cursor-pointer"
                  onClick={() => {
                    switchDefaultWorkspace(workspace);
                    setOpen(false);
                    toast.success(`Switch Workspace to ${workspace.name}`);
                  }}
                >
                  <span>{workspace.name}</span>
                  {defaultWorkspace?.id === workspace.id ? (
                    <span className="text-white bg-black py-1 px-2 rounded text-xs">
                      Current
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          )}
          <WorkspaceAddButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
