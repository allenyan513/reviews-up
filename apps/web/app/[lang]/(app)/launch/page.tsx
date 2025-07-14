'use client';
import { redirect } from 'next/navigation';
import { useSession } from '@/context/UserProvider';
import { UserEntity } from '@reviewsup/api/users';

export default function Page(props: { params: Promise<{ lang: string }> }) {
  const { user } = useSession({
    required: true,
    onUnauthenticated: (user: UserEntity) => {
      redirect(
        `/auth/signin?redirect=${encodeURIComponent(`/${user.Workspace[0].id}/promotion/my-products`)}`,
      );
    },
  });

  if (user) {
    // user is authenticated, redirect to the promotion page
    redirect(`/${user.Workspace[0].id}/promotion/my-products`);
  }
  return null;
}
