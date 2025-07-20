export function toLocalDateString(date: Date | string): string {
  const _date = new Date(date);
  const locale =
    typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(_date);
}

const embedCodeTemplate2 = `
<div id="reviewsup-embed-{{widgetId}}"></div>
<script type="module" src="https://unpkg.com/@reviewsup/embed-react/dist/embed/embed.es.js" defer/>
`;

export function getEmbedCode(widgetShortId: string): string {
  return embedCodeTemplate2
    .replace(/{{widgetId}}/g, widgetShortId || 'your-widget-id')
    .trim();
}
