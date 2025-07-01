export default function FAQ(props: {
  data?: {
    question: string;
    answer: string;
  }[];
}) {
  return (
    <section id="faq" className="w-full p-4">
      <div className="">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="w-full space-y-4">
          {props.data?.map((item, index) => (
            <details
              key={index}
              className="group rounded-xl bg-white p-4 shadow-md transition open:ring-2"
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
      </div>
    </section>
  );
}
