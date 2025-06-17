import { BsTwitterX } from 'react-icons/bs';

export async function ReviewItemSource(props: {
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
      {props.source === 'twitter' && <BsTwitterX />}
      {props.source !== 'twitter' && <span></span>}
    </div>
  );
}
