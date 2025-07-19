
export function PoweredBy(props: { className?: string }) {
  return (
    <a
      // className={cn(
      //   'flex items-center justify-center text-xs text-gray-400',
      //   props.className,
      // )}
      href='https://reviewsup.io'
      target="_blank"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        color: '#9CA3AF', // Tailwind's text-gray-400
        textDecoration: 'none',
      }}
    >
      Powered by reviewsup.io
    </a>
  );
}
