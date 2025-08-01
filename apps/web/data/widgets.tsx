import { FileTreeItem } from '@/components/code-viewer';


//todo fix this import
const embedCodeTemplate2 = `
<div id="reviewsup-embed-{{widgetId}}"></div>
<script type="module" src="https://unpkg.com/@reviewsup/embed-react/dist/embed/embed.es.js" defer/>
`;

export const rawFileTree: FileTreeItem[] = [
  {
    name: 'app',
    type: 'folder',
    path: 'app',
    lang: '',
    children: [
      {
        path: 'app/page.tsx',
        name: 'page.tsx',
        lang: 'tsx',
        type: 'file',
      },
      {
        path: 'app/index.css',
        name: 'index.css',
        lang: 'css',
        type: 'file',
      },
    ],
  },
  {
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    lang: 'json',
  },
];

export const codeMap: Record<string, string> = {
  'app/page.tsx': `'use client';
import { WidgetClient } from '@reviewsup/embed-react';
import './index.css';
      
export default function Page() {
        
  return (
    <>
      <WidgetClient widgetId={'92620b6dda4'} />
    </>
  );
}
 `,
  'app/index.css': `@import "@reviewsup/embed-react/styles.css";`,
  'package.json': `{
  "name": "demo",
  "version": "0.0.0",
  "dependencies": {
    "@reviewsup/embed-react": "^0.0.3"
  }
}
  `,
};

export function getWidgetData(): {
  title: string;
  subtitle: React.ReactNode;
  embedCode: string;
  items: {
    title: string;
    widgetId: string;
    rawFileTree: FileTreeItem[];
    codeMap: Record<string, string>;
  }[];
} {
  const widgetIds = (process.env.NEXT_PUBLIC_WIDGET_IDS as string)
    .split(',')
    .map((id) => id.trim());

  //Add testimonials to your website with no coding!
  // Copy and paste our HTML code to add the Wall Of Love (👉 full version) to your website. We support any no-code platform (Webflow, WordPress, you name it!)
  return {
    title: 'Embed reviews on your website with built-in widgets',
    subtitle: (
      <p className="flex flex-col">
        <span>
          Easily integrate beautifully designed widgets into your site
        </span>
        <span>
          just copy and paste a simple HTML snippet{' '}
          <span className="text-red-500 font-semibold"> in just minutes.</span>
        </span>
      </p>
    ),
    embedCode: embedCodeTemplate2.replace(
      '{{widgetId}}',
      widgetIds[0] || '',
    ).trim(),
    items: [
      {
        title: 'Flow',
        widgetId: widgetIds[0] || '',
        rawFileTree: rawFileTree,
        codeMap: codeMap,
      },
      {
        title: 'Grid',
        widgetId: widgetIds[1] || '',
        rawFileTree: rawFileTree,
        codeMap: codeMap,
      },
      {
        title: 'Carousel',
        widgetId: widgetIds[2] || '',
        rawFileTree: rawFileTree,
        codeMap: codeMap,
      },
      {
        title: 'Avatar',
        widgetId: widgetIds[3] || '',
        rawFileTree: rawFileTree,
        codeMap: codeMap,
      },
    ],
  };
}
