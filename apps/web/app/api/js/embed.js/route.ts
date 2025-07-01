import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const domain = `${process.env.NEXT_PUBLIC_APP_URL}`.trim();

  const scriptContent = `
    (function () {
      const domain = '${domain}';
      console.log('Embed script running from domain:', domain);
      const widgets = document.querySelectorAll('[id^="reviewsup-showcase-"]');

      widgets.forEach((el) => {
        const widgetId = el.id.split('reviewsup-showcase-')[1];

        const iframe = document.createElement('iframe');
        iframe.src = domain + '/showcases/' + widgetId;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        el.appendChild(iframe);
      });
    })();
  `;
  return new NextResponse(scriptContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      // 'Cache-Control': 'public, max-age=3600, immutable', // 缓存设置，根据需要调整
    },
  });
}
