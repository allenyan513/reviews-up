export function ReviewItemSource2(props: {
  source: string;
  className?: string;
}) {
  const { source, className } = props;

  const iconUrl = {
    tiktok: 'https://www.tiktok.com/favicon.ico',
    twitter: 'https://abs.twimg.com/favicons/twitter.3.ico',
    manual: 'https://app.reviewsup.io/img/logo-32.png',
    google: 'https://www.google.com/favicon.ico',
  };

  return (
    <div className={className}>
      <img
        className="w-6 h-6"
        src={iconUrl[source] || ''}
        alt={`${source} icon`}
      />
    </div>
  );
}
