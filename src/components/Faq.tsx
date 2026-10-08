export type FaqItem = { question: string; answer: string };

// Plain server-rendered markup (no animation) so crawlers and AI answer engines read it as-is.
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" className="py-24 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>
        <dl className="max-w-3xl mx-auto space-y-4">
          {items.map((item) => (
            <div key={item.question} className="glass rounded-2xl p-6">
              <dt className="text-lg font-semibold text-white mb-2">{item.question}</dt>
              <dd className="text-gray-300 leading-relaxed break-words">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
