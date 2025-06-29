'use client';
import { ShowcaseProvider } from '@/modules/showcase/context/showcase-context';

export default function RootLayout(props: { children: React.ReactNode }) {
  return <ShowcaseProvider  >{props.children}</ShowcaseProvider>;
}
