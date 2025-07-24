'use client';

import { IconDotsVertical } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useUserContext } from '@/context/UserProvider';
import { BsPlusCircle } from 'react-icons/bs';

export function NavProduct(props: {}) {
  const router = useRouter();
  const { user, defaultProduct, saveDefaultProduct } = useUserContext();
  const { isMobile } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded">
                  <AvatarImage
                    src={defaultProduct?.icon}
                    alt={defaultProduct?.name}
                  />
                  <AvatarFallback className="rounded">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {defaultProduct?.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {defaultProduct?.status}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-2 font-normal">
                <h2 className="text-sm font-semibold">ALL PRODUCTS</h2>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex flex-col gap-2">
                {user && user.products && user.products.length > 0 && (
                  <>
                    {user.products.map((product) => (
                      <DropdownMenuItem
                        key={product.id}
                        className="cursor-pointer"
                        onClick={() => {
                          saveDefaultProduct(product);
                          setOpen(false);
                          router.push(`/${product.id}/overview`);
                        }}
                      >
                        <Avatar className="h-8 w-8 rounded">
                          <AvatarImage
                            src={product?.icon}
                            alt={product?.name}
                          />
                          <AvatarFallback className="rounded">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {product?.name}
                          </span>
                          <span className="text-muted-foreground truncate text-xs">
                            {product?.status}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => {
                    setOpen(false);
                    router.push('/products/new');
                  }}
                >
                  <BsPlusCircle /> Create New Product
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
