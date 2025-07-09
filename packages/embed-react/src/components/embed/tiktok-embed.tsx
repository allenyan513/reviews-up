import React, { useEffect, useRef, useState } from 'react';

/**
 * 如果width和height不传，则根据动态计算当前容器的宽度，然后根据thumbnailWidth和thumbnailHeight计算高度
 * 如果传了width和height，则直接使用传入的值
 * @param props
 * @constructor
 */
export function TikTokEmbed(props: {
  tiktokId: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  width?: string;
  height?: string;
}) {
  const { tiktokId, thumbnailHeight, thumbnailWidth, width, height } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeWidth, setIframeWidth] = useState<string>(width || '100%');
  const [iframeHeight, setIframeHeight] = useState<string>(height || '100%');

  if (!tiktokId || !thumbnailWidth || !thumbnailHeight) {
    console.error('No tiktok id found');
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
        const ratio = thumbnailHeight / thumbnailWidth;
        setIframeWidth('100%');
        setIframeHeight(`${width * ratio}px`);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [thumbnailWidth, thumbnailHeight]);

  return (
    <div ref={containerRef} className="w-full">
      <iframe
        src={`https://www.tiktok.com/player/v1/${tiktokId}?progress_bar=0&timestamp=0&fullscreen_button=0&volume_control=0`}
        title="TikTok Video"
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
