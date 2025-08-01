export default function FAQ(props: {
  data?: {
    question: string;
    answer: string;
  }[];
}) {
  return (
    <section className="w-full">
      <h2 className="mb-10 text-center text-3xl md:text-4xl font-semibold text-gray-900">
        FAQ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {props.data?.map((item, index) => (
          <details
            key={index}
            className="group p-4"
            open={true}
          >
            <summary className="cursor-pointer text-lg font-semibold">
              {item.question}
            </summary>
            <p className="mt-2 text-gray-700 whitespace-normal">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
