import { BsTwitterX } from 'react-icons/bs';
import React from 'react';

export function ReviewItemSource(props: {
  source: string;
  className?: string;
}) {
  const renderSource = () => {
    if (props.source === 'twitter') {
      return <BsTwitterX className="text-xl" />;
    } else if (props.source === 'manual') {
      return <img src={'/img/logo-32.png'} alt="Manual" />;
    }
    return <span>{props.source}</span>;
  };

  return <div className="w-8 h-8">{renderSource()}</div>;
}
