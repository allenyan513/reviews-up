import { FileTreeItem } from '@/components/code-viewer';

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
import { ShowcaseClient } from '@reviewsup/embed-react';
import './index.css';
      
export default function Page() {
        
  return (
    <>
      <ShowcaseClient showcaseId={'92620b6dda4'} />
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

export const showcaseData: {
  title: string;
  subtitle: React.ReactNode;
  formId: string;
  items: {
    title: string;
    showcaseId: string;
    rawFileTree: FileTreeItem[];
    codeMap: Record<string, string>;
  }[];
} = {
  title: 'Build-in Review Widgets',
  subtitle: (
    <span>
      Seamlessly and quickly integrate a review widget into your website — <span className='text-red-500 font-semibold'>in just minutes.</span>
    </span>
  ),
  formId:
    process.env.NODE_ENV === 'development' ? '9aecce7e3db' : 'f09dbd1ff08',
  items: [
    {
      title: 'Flow',
      showcaseId:
        process.env.NODE_ENV === 'development' ? '25db6a933d3' : '2c337712ccd',
      rawFileTree: rawFileTree,
      codeMap: codeMap,
    },
    {
      title: 'Carousel',
      showcaseId:
        process.env.NODE_ENV === 'development' ? 'd389d637944' : 'dbca7f09470',
      rawFileTree: rawFileTree,
      codeMap: codeMap,
    },
    {
      title: 'Grid',
      showcaseId:
        process.env.NODE_ENV === 'development' ? '29fa5c4d361' : '92620b6dda4',
      rawFileTree: rawFileTree,
      codeMap: codeMap,
    },
    {
      title: 'Avatar List',
      showcaseId:
        process.env.NODE_ENV === 'development' ? '148ac173529' : 'b68f3f0a0a2',
      rawFileTree: rawFileTree,
      codeMap: codeMap,
    },


  ],
};
