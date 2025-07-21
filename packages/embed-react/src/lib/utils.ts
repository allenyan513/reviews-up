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

const badgeEmbedCode = `
<a href="{{wwwUrl}}/products/{{productIdOrSlug}}" target="_blank">
<img src="{{apiUrl}}/products/{{productIdOrSlug}}/badge.svg?theme={{theme}}"
  style="width: 230px; height: 54px;"
  width="230"
  height="54" />
</a>
`;

export function getEmbedCode(widgetShortId: string): string {
  return embedCodeTemplate2
    .replace(/{{widgetId}}/g, widgetShortId || 'your-widget-id')
    .trim();
}

export function getBadgeEmbedCode(
  productIdOrSlug: string,
  theme: 'light' | 'dark' = 'light',
  wwwUrl?: string,
  apiUrl?: string,
): string {
  const defaultWWWUrl = wwwUrl ? wwwUrl : 'https://reviewsup.io';
  const defaultApiUrl = apiUrl ? apiUrl : 'https://api.reviewsup.io';
  return badgeEmbedCode
    .replace(/{{productIdOrSlug}}/g, productIdOrSlug)
    .replace(/{{wwwUrl}}/g, defaultWWWUrl)
    .replace(/{{apiUrl}}/g, defaultApiUrl)
    .replace(/{{theme}}/g, theme)
    .trim();
}
