export default function FAQ(props: {
  data?: {
    question: string;
    answer: string;
  }[];
}) {
  return (
    <section
      id="faq"
      className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="container mx-auto px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl space-y-4">
          {props.data?.map((item, index) => (
            <details
              key={index}
              className="group rounded-xl bg-white p-4 shadow-md transition open:ring-2"
            >
              <summary className="cursor-pointer text-lg font-semibold">
                {item.question}
              </summary>
              <p className="mt-2 text-gray-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
