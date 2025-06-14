'use client';
import { ShowcaseProvider } from '@/modules/showcase/context/ShowcaseProvider';

export default function RootLayout(props: { children: React.ReactNode }) {
  return <ShowcaseProvider>{props.children}</ShowcaseProvider>;
}
