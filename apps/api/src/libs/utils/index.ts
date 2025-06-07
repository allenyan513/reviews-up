import * as crypto from 'crypto';

export function filterUrl(url: string, limit = 254) {
  if (url.length > limit) {
    return '';
  }
  return url;
}

export function completeUrl(url: string, path: string) {
  if (path.startsWith('http')) {
    return path;
  }
  if (url.endsWith('/')) {
    return url + path;
  } else {
    return url + '/' + path;
  }
}

export function formatArrayStringToMarkdown(arr: string[]) {
  if (!arr || arr.length === 0) {
    return '';
  }
  return arr.map((feature) => `- ${feature}`).join('\n');
}

export function formatNameDescriptionArrayToMarkdown(
  array: { name: string; description: string }[],
) {
  if (!array || array.length === 0) {
    return '';
  }
  return array
    .map((item) => `- **${item.name}**: ${item.description}`)
    .join('\n');
}
export function hash(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function generateIdToken(): string {
  return crypto.randomBytes(16).toString('hex');
}
