export function ReviewItemSource(props: {
  source: string;
  sourceUrl?: string;
  className?: string;
  isDoFollowEnabled?: boolean;
  clickable?: boolean;
}) {
  const { source, sourceUrl, className, clickable = true } = props;
  const iconUrl = {
    manual: 'https://reviewsup.io/img/logo-32.png',
    tiktok: 'https://www.tiktok.com/favicon.ico',
    twitter: 'https://abs.twimg.com/favicons/twitter.3.ico',
    google: 'https://www.google.com/favicon.ico',
    linkedin: 'https://www.linkedin.com/favicon.ico',
  };
  return (
    <div className={className}>
      {clickable ? (
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
            src={iconUrl[source] || ''}
            alt={`${source} icon`}
            style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '0.25rem',
              objectFit: 'cover',
            }}
          />
        </a>
      ) : (
        <img
          src={iconUrl[source] || ''}
          alt={`${source} icon`}
          style={{
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '0.25rem',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
}
