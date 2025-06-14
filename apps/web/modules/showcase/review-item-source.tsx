import { BsTwitterX } from 'react-icons/bs';
import React from 'react';

export function ReviewItemSource(props: {
  source: string
  className?: string
}) {
  if (props.source === 'twitter') {
    return (
      <div className="flex items-center px-2">
        <BsTwitterX className="text-xl" />
      </div>
    );
  } else if (props.source === 'manual') {
    return <img src={'/img/logo-32.png'} alt="Manual" className="h-6 w-6 px-2" />;
  }
  return <span className='px-2'>{props.source}</span>;
}
