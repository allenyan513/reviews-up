// scripts/generate-embed.js
const fs = require('fs');
const path = require('path');

const EMBED_JS_PATH = path.join(__dirname, '../public/js/embed.js');

// 从环境变量中读取
const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const content = `
(function() {
    const domain = '${DOMAIN}';
    console.log('Embed script running from domain:', domain);
    // window.addEventListener('DOMContentLoaded', () => {
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
    // });
})();
`;

fs.writeFileSync(EMBED_JS_PATH, content, 'utf8');
console.log(`✅ embed.js 生成完毕，域名为：${DOMAIN}`);
