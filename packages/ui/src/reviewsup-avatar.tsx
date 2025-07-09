import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { cn } from './lib/utils';

export function ReviewsupAvatar(props: {
  uri: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const { uri, name } = props;
  const size = props.size || 'md';
  return (
    <Avatar>
      <AvatarImage
        src={uri}
        alt="Reviewsup Avatar"
        className={cn(
          'rounded-full object-contain',
          size === 'sm' ? 'w-5 h-5' : '',
          size === 'md' ? 'w-8 h-8' : '',
          size === 'lg' ? 'w-10 h-10' : '',
          size === 'xl' ? 'w-12 h-12' : '',
        )}
      />
      <AvatarFallback className="bg-muted items-center justify-center rounded-full w-8 h-8">
        {name ? name.charAt(0).toUpperCase() : 'U'}
      </AvatarFallback>
    </Avatar>
  );
}
