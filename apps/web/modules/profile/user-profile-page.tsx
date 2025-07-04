import { UserEntity } from '@repo/api/users';
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ListLayoutClient } from '@reviewsup/embed-react';
import { PoweredBy } from '@reviewsup/embed-react';

export function UserProfilePage(props: { user: UserEntity; className?: string }) {
  const { user, className } = props;
  const { avatarUrl, name, email } = user;
  return (
    <div className={clsx('bg-gray-100 min-h-screen p-8', props.className)}>
      <div
        className={
          'flex flex-col items-center p-8 border border-gray-300 rounded-lg shadow-lg lg:w-3/4 lg:max-w-2xl lg:mx-auto gap-8 bg-white'
        }
      >
        <div className="flex flex-row gap-4 w-full justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <Avatar className="size-16 shadow-md border border-gray-500 rounded-full">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="AvatarFallback" delayMs={600}>
                {name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
          <Button
            onClick={() => {
              window.open('', '_blank');
            }}
            size={'lg'}
          >
            Visit
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full text-start">
          <h2 className="text-xl font-semibold">My Reviews</h2>
          {/*<h2 className="text-xl font-semibold">Reviews</h2>*/}
          {/*<h2 className="text-xl font-semibold">Reviews</h2>*/}
        </div>
        <ListLayoutClient
          items={user.Review || []}
          config={{
            type: 'list',
            isRatingEnabled: true,
            isSourceEnabled: true,
            isDateEnabled: true,
            isImageEnabled: true,
            isVideoEnabled: true,
            count: 10,
            sortBy: 'newest',
          }}
        />
      </div>
      <PoweredBy />
    </div>
  );
}
