export function ReviewItemSource2(props: {
  source: string;
  className?: string;
}) {
  const { source, className } = props;

  const iconUrl = {
    manual: 'https://app.reviewsup.io/img/logo-32.png',
    tiktok: 'https://www.tiktok.com/favicon.ico',
    twitter: 'https://abs.twimg.com/favicons/twitter.3.ico',
    google: 'https://www.google.com/favicon.ico',
    linkedin: 'https://www.linkedin.com/favicon.ico',
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
