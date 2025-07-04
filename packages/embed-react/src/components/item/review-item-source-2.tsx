export function ReviewItemSource2(props: {
  source: string;
  className?: string;
}) {
  return (
    <div className={props.className}>
      {props.source === 'twitter' && (
        <img
          className="w-6 h-6"
          src="https://abs.twimg.com/favicons/twitter.3.ico"
        />
      )}
      {props.source === 'manual' && (
        <img
          className="w-6 h-6"
          src="https://app.reviewsup.io/img/logo-32.png"
        />
      )}
    </div>
  );
}
