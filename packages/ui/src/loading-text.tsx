import { Loader2 } from 'lucide-react';

export function LoadingText(props: { children: React.ReactNode }) {
  return (
    <span className="flex items-center justify-center gap-1">
      <Loader2 className="h-4 w-4 animate-spin" />
      {props.children}
    </span>
  );
}
