export function DashboardRoot(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div className="min-h-screen p-6 md:p-8">{children}</div>;
}
