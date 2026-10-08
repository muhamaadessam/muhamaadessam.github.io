import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export type FaqItem = { question: string; answer: string; answerContent?: ReactNode };

// Native disclosure keeps every answer in the server HTML without client JavaScript.
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" className="py-24 bg-dark-bg">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="section-heading mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-[22ch]">Frequently Asked Questions</h2>
          <div className="h-0.5 w-16 bg-primary rounded-full" />
        </div>
        <div className="border-t border-white/10">
          {items.map((item) => (
            <details key={item.question} className="faq-disclosure group border-b border-white/10">
              <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer text-lg font-medium text-white hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4">
                <span>{item.question}</span>
                <ChevronDown className="w-5 h-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="faq-answer text-gray-300 leading-relaxed break-words max-w-[75ch] pb-6">{item.answerContent ?? item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
