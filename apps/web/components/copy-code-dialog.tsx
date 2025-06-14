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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { CodeBlockClient } from '@/components/code-block-client';
import { BsCopy } from 'react-icons/bs';
import toast from 'react-hot-toast';

export function CopyCodeDialog(props: {
  title: string;
  codes: string[];
  children: React.ReactNode;
}) {
  const {title,codes, children} = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-8">
          <Label htmlFor="workspace-name">
            Copy the following code and paste to your site:
          </Label>
          <div className="relative rounded-md border mt-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(codes.join('\n'));
                toast.success('Code copied to clipboard!');
              }}
              variant="outline"
              className="absolute top-2 right-2"
            >
              <BsCopy />
            </Button>
            <CodeBlockClient lang="html">{codes.join('\n')}</CodeBlockClient>
          </div>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="default">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
