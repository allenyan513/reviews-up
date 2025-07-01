'use client';
import { use, useEffect, useState } from 'react';
import { User } from '@repo/api/users/index';
import { api } from '@/lib/api-client';
import { UserProfilePage } from '@/modules/profile/user-profile-page';
import toast from 'react-hot-toast';

export default function Page(props: {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}) {
  const { slug } = use(props.params);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.user
      .findOneBySlug(slug)
      .then((user) => {
        if (user) {
          setUserProfile(user);
        }
      })
      .catch((error) => {
        toast.error('User not found');
      });
  }, [slug]);

  if (!userProfile) {
    return null;
  }
  return <UserProfilePage user={userProfile} />;
}
