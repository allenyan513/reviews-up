export function CustomerGridItem(props: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
      <div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
        {props.icon}
        <div className="space-y-2">
          <h3 className="font-bold">{props.title}</h3>
          <p className="text-sm text-muted-foreground">{props.description}</p>
        </div>
      </div>
    </div>
  );
}

export function CustomersGrid(props: {
  title: string;
  subtitle: string;
  items: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}) {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">{props.title}</h2>
        <p className="max-w-[85%] text-muted-foreground sm:text-lg">
          {props.subtitle}
        </p>
      </div>
      <div className="grid justify-center gap-4 grid-cols-1 md:grid-cols-2">
        {props.items.map((item, index) => (
          <CustomerGridItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
