export function ReviewItemSource(props: {
  source: string;
  sourceUrl?: string;
  className?: string;
  isDoFollowEnabled?: boolean;
}) {
  const { source, sourceUrl, className } = props;
  const iconUrl = {
    manual: 'https://app.reviewsup.io/img/logo-32.png',
    tiktok: 'https://www.tiktok.com/favicon.ico',
    twitter: 'https://abs.twimg.com/favicons/twitter.3.ico',
    google: 'https://www.google.com/favicon.ico',
    linkedin: 'https://www.linkedin.com/favicon.ico',
  };
  return (
    <div className={className}>
      <a
        href={sourceUrl || '#'}
        target="_blank"
        rel={
          props.isDoFollowEnabled
            ? 'noopener noreferrer'
            : 'nofollow noopener noreferrer'
        }
      >
        <img
          className="w-6 h-6 rounded"
          src={iconUrl[source] || ''}
          alt={`${source} icon`}
        />
      </a>
    </div>
  );
}
