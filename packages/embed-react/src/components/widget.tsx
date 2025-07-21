'use client';
import { RequestOptions } from '../api/request-options';
import { useWidget } from '../hooks/use-widget';
import { WidgetContent } from './widget-content';
import React, { forwardRef } from 'react';

type WidgetProps = {
  id: string;
  options?: RequestOptions;
} & React.HTMLAttributes<HTMLDivElement>;

export const Widget = forwardRef<HTMLDivElement, WidgetProps>((props, ref) => {
  const { id, options, ...rest } = props;
  const { widget, error } = useWidget(id, options);

  if (!widget) {
    return null;
  }
  return (
    <div ref={ref} id={`reviewsup-embed-${id}`} {...rest}>
      <WidgetContent widget={widget} />
    </div>
  );
});
