'use client'; // This directive marks the component as a Client Component

import React, { useEffect } from 'react';

interface ReviewsUpShowcaseClientProps {
  showcaseId: string;
}

export function ReviewsUpShowcaseClient({ showcaseId }: ReviewsUpShowcaseClientProps) {
  useEffect(() => {
    const existingScript = document.getElementById('reviewsup-embed-js');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'reviewsup-embed-js'; // 为脚本设置 ID，方便后续检查
      script.type = 'text/javascript';
      script.src = 'http://localhost:3000/js/embed.js';
      script.defer = true; // 使用 defer 属性确保脚本在 HTML 解析后执行，但不阻塞渲染
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className='w-full h-[900px]'
      id={`reviewsup-showcase-${showcaseId}`}/>
  );
}
