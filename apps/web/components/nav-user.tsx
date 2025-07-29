'use client';

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconTrash,
  IconStar,
} from '@tabler/icons-react';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React from 'react';
import { Input } from '@reviewsup/ui/input';
import { useUserContext } from '@/context/UserProvider';

export function NavUser(props: {}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const { user, signOut, deleteAccount } = useUserContext();

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
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
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
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/dashboard/account/profile');
                  }}
                >
                  <IconUserCircle />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/dashboard/account/my-reviews');
                  }}
                >
                  <IconStar />
                  My Reviews
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/dashboard/account/billing');
                  }}
                >
                  <IconCreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/dashboard/account/notifications');
                  }}
                >
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <IconLogout />
                Sign out
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                }}
              >
                <IconTrash className="text-red-500" />
                <span className="text-red-500">Delete account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your account and all
              associated data. This action cannot be undone.
              <br />
              <br />
              Please type <strong>DELETE</strong> to confirm.
              <Input
                type="text"
                className="mt-2 w-full"
                placeholder={'DELETE'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (value.toUpperCase() === 'DELETE') {
                  deleteAccount();
                  setOpen(false);
                  router.push('/dashboard');
                } else {
                  alert('Please type DELETE to confirm.');
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
