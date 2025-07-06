import React, { useEffect, useRef, useState } from 'react';

import { LinkedinEmbedCode } from '@reviewsup/api/linkedin';

/**
 * 如果width和height不传，则根据动态计算当前容器的宽度，然后根据thumbnailWidth和thumbnailHeight计算高度
 * 如果传了width和height，则直接使用传入的值
 * @param props
 * @constructor
 */
export function LinkedinEmbed(props: {
  linkedinEmbedCode: LinkedinEmbedCode;
  width?: string;
  height?: string;
}) {
  const { linkedinEmbedCode, width, height } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeWidth, setIframeWidth] = useState<string>(width || '100%');
  const [iframeHeight, setIframeHeight] = useState<string>(height || '100%');

  if (
    !linkedinEmbedCode ||
    !linkedinEmbedCode.src ||
    !linkedinEmbedCode.height ||
    !linkedinEmbedCode.width
  ) {
    console.error('No LinkedIn embed code found');
    return null;
  }
  useEffect(() => {
    if (width && height) {
      return;
    }
    if (!containerRef.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const ratio = linkedinEmbedCode.height / linkedinEmbedCode.width;
        setIframeWidth('100%');
        setIframeHeight(`${width * ratio}px`);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [linkedinEmbedCode.width, linkedinEmbedCode.height]);

  return (
    <div ref={containerRef} className="w-full">
      <iframe
        src={linkedinEmbedCode.src}
        title="LinkedIn Post"
        allowFullScreen
        style={{
          width: iframeWidth,
          height: iframeHeight,
          border: 'none',
        }}
        className="rounded-md"
      />
    </div>
  );
}
