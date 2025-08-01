'use client';

import { WallOfLoveProvider } from '@/modules/wall-of-love/wall-of-love-context';

export default function RootLayout(props: { children: React.ReactNode }) {
  return <WallOfLoveProvider>{props.children}</WallOfLoveProvider>;
}
