export function IntegrationsGrid(props: {
  title: string;
  subtitle: string;
  items: {
    icon: string;
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
      <div className="grid justify-center gap-4 grid-cols-2 md:grid-cols-4">
        {props.items.map((item, index) => (
          <img
            key={index}
            src={item.icon}
            alt={`Integration ${index + 1}`}
            className="w-full h-20 p-4 object-contain border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
          />
        ))}
      </div>
    </section>
  );
}
