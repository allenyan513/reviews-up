export function ReviewItemSource(props: {
  source: string;
  className?: string;
}) {
  return (
    <div className={props.className}>
      {props.source === 'twitter' && (
        <img
          className="w-4 h-4 rounded-full"
          src="https://abs.twimg.com/favicons/twitter.3.ico"
        />
      )}
      {props.source === 'manual' && (
        <img
          className="w-4 h-4 rounded-full"
          src="https://app.reviewsup.io/img/logo-32.png"
        />
      )}
    </div>
  );
}
