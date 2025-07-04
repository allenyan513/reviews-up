export function ReviewItemSource(props: {
  source: string;
  sourceUrl?: string;
  className?: string;
  isDoFollowEnabled?: boolean;
}) {
  const { source, sourceUrl, className } = props;
  return (
    <div className={className}>
      {source === 'twitter' && (
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
            src="https://abs.twimg.com/favicons/twitter.3.ico"
          />
        </a>
      )}
    </div>
  );
}
