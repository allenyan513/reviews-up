import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BiSortAlt2 } from 'react-icons/bi';
import { useUserContext } from '@/context/UserProvider';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ProductEntity } from '@reviewsup/api/products';
import { redirect, useRouter } from 'next/navigation';

export function ProductSwitchButton(props: {
  product: ProductEntity | null | undefined;
}) {
  const { user, defaultProduct, saveDefaultProduct } = useUserContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-row items-center justify-between border border-gray-300 rounded-lg p-4 mb-2 gap-1 hover:border-gray-500 cursor-pointer">
          <div className="flex flex-col gap-2">
            <p>{defaultProduct?.name || 'No Products'}</p>
            <p className="text-xs text-gray-500">Change product</p>
          </div>
          <BiSortAlt2 className="text-2xl text-gray-500" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Switch Product</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex  flex-col gap-2">
          {user && user.products && user.products.length > 0 && (
            <div className="flex flex-col gap-2">
              {user.products.map((product: ProductEntity) => (
                <div
                  key={product.id}
                  className="flex flex-row w-full justify-between items-center p-6 border border-gray-300 rounded-lg hover:border-gray-500 cursor-pointer"
                  onClick={() => {
                    saveDefaultProduct(product);
                    setOpen(false);
                    toast.success(`Switch Product to ${product.name}`);
                    redirect(`/${product.id}/reviews/all`);
                  }}
                >
                  <span>{product.name}</span>
                  {defaultProduct?.id === product.id ? (
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
          <span
            onClick={() => {
              setOpen(false);
              router.push('/products/new');
            }}
            className="text-sm mt-4 cursor-pointer"
          >
            + <span className="underline">Creat a new Product</span>
          </span>
          {/*<ProductAddButton />*/}
        </div>
      </DialogContent>
    </Dialog>
  );
}
