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
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { useFormContext } from './context/FormProvider';

export default function CreateFormDialog(props: {}) {
  const { defaultProduct } = useUserContext();
  const { createForm } = useFormContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>('');

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
          <Button
            type="submit"
            onClick={async () => {
              if (!defaultProduct || !defaultProduct.id) {
                toast.error('Please select a workspace first.');
                return;
              }
              await createForm(defaultProduct.id, formName);
              setFormName('');
              setIsOpen(false);
            }}
            className="ml-2"
          >
            Create Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
