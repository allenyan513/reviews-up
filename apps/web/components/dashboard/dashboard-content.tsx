import { cn } from '@reviewsup/ui/lib/utils';

export function DashboardContent(props: {
  children: React.ReactNode;
  className?: string;
}) {
  const { children, className } = props;
  return <div className={cn(className)}>{children}</div>;
}
