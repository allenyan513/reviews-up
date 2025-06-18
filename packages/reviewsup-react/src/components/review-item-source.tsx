export function ReviewItemSource(props: {
  source: string;
  className?: string;
}) {
  return (
    <div
      className={props.className}
      style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
        fontSize: '0.5rem',
      }}
    >
      {props.source === 'twitter' && (
        // rounded-full
        <img
          style={{
            width: '1rem',
            height: '1rem',
            verticalAlign: 'middle',
            borderRadius: '50%',
          }}
          src="https://abs.twimg.com/favicons/twitter.3.ico"
        />
      )}
      {props.source === 'manual' && (
        <img
          style={{
            width: '1rem',
            height: '1rem',
            verticalAlign: 'middle',
            borderRadius: '50%',
          }}
          src='https://app.reviewsup.io/img/logo-32.png'
        />
      )}
    </div>
  );
}
