'use client';

import React, { use, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@reviewsup/ui/dropdown-menu';
import Link from 'next/link';
import { BiPlus, BiShareAlt } from 'react-icons/bi';
import { buttonVariants } from '@reviewsup/ui/button';
import { ProductEntity, ProductStatus } from '@reviewsup/api/products';
import { api } from '@/lib/api-client';
import ProductStatusFlow, {
  StatusStep,
} from '@/components/product-status-flow';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BsInfoCircle,
  BsTrash,
  BsBoxArrowUpRight,
  BsEye,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export function PromotionMyProducts(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { lang, workspaceId } = use(props.params);
  const router = useRouter();
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const onClickDelete = (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    if (!productId) {
      console.error('Product ID is required for deletion');
      return;
    }
    api.product
      .deleteOne(productId)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId),
        );
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  const fetchData = async () => {
    if (!workspaceId) {
      return;
    }
    api.product
      .findAll({
        workspaceId: workspaceId,
        status: [
          // ProductStatus.draft,
          ProductStatus.waitingForAdminReview,
          ProductStatus.pendingForReceive,
          ProductStatus.pendingForSubmit,
          ProductStatus.listing,
          ProductStatus.rejected,
        ],
        page: page,
        pageSize: pageSize,
      })
      .then((response) => {
        setProducts(response);
      });
  };

  useEffect(() => {
    fetchData();
  }, [workspaceId]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${lang}/${workspaceId}/forms`}
            className="flex flex-row items-center gap-2 "
          >
            <h1 className="text-3xl font-semibold text-gray-900 line-clamp-1">
              My Products
            </h1>
          </Link>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <div className={'flex flex-row gap-1 md:gap-2'}>
          <Link
            className={buttonVariants({
              variant: 'default',
              size: 'lg',
            })}
            href={`/${lang}/${workspaceId}/promotion/my-products/new`}
          >
            <BiPlus className="text-2xl" />
            Submit Product
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-md gap-2 flex flex-col"
            >
              <div className="flex flex-row items-center gap-2 justify-between">
                <div className="flex flex-row items-center gap-3">
                  <img
                    className="w-5 h-5"
                    src={product.icon}
                    alt={product.name}
                  />
                  <h2 className="text-2xl line-clamp-1">
                    {product.name}
                    {/*{product.status === ProductStatus.draft && (*/}
                    {/*  <span className="text-gray-500 text-sm"> (Draft)</span>*/}
                    {/*)}*/}
                  </h2>
                </div>
                <div className="flex flex-row items-center gap-2 text-lg">
                  {/*{product.status === 'draft' ? (*/}
                  {/*  <Link*/}
                  {/*    href={`/${lang}/${workspaceId}/promotion/my-products/draft/${product.id}`}*/}
                  {/*  >*/}
                  {/*    <FiEdit />*/}
                  {/*  </Link>*/}
                  {/*) : (*/}
                  <Link
                    href={`/${lang}/${workspaceId}/promotion/my-products/edit/${product.id}`}
                  >
                    <FiEdit />
                  </Link>
                  {/*)}*/}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <BsThreeDotsVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            onClickDelete(product?.id || '');
                          }}
                        >
                          Delete
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-col md:grid md:grid-cols-12 py-2 gap-4">
                <div className="text-gray-600 col-span-6">
                  <p className="font-medium mb-2 flex flex-row items-center gap-2">
                    Product Status:
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <BsInfoCircle />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="text-md max-w-md">
                        <strong>Waiting for Your Submit</strong>: You need to
                        submit more reviews. When the number of reviews you’ve
                        submitted exceeds the number of reviews you've received,
                        your product will move to the "Listing in Queue" state.
                        <br />
                        <strong>Listing in Queue</strong>: Your product is
                        currently in the review queue. You can find it under
                        "Apps to Review".
                        <br />
                        <strong>Listing in Public</strong>: You’ve completed all
                        required tasks. Your product is now publicly listed and
                        open to all users for reviews — no more actions needed
                        on your side.
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <ProductStatusFlow status={product.status as StatusStep} />
                </div>

                <div className="text-gray-600 col-span-3">
                  <p className="">Received:</p>
                  <p className="text-5xl mt-4">
                    {product.receiveReviewCount}
                    {product.status === 'listing'
                      ? ''
                      : `/${product.submitReviewCount}`}
                  </p>
                </div>
                <div className="text-gray-600 col-span-3">
                  <p className="">Submitted:</p>
                  <p className="text-5xl mt-4">
                    {product.submitReviewCount}
                    {product.status === 'listing'
                      ? ''
                      : `/${product.taskReviewCount}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
