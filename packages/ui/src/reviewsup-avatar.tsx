import { Avatar, AvatarFallback, AvatarImage } from './avatar';

export function ReviewsupAvatar(props: { uri: string; name?: string }) {
  return (
    <Avatar>
      <AvatarImage
        src={props.uri}
        alt="Reviewsup Avatar"
        className="rounded-full w-8 h-8 object-cover"
      />
      <AvatarFallback className="bg-muted items-center justify-center rounded-full w-8 h-8">
        {props.name ? props.name.charAt(0).toUpperCase() : 'U'}
      </AvatarFallback>
    </Avatar>
  );
}
