"use client";
import { useState } from "react";

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I pay for my ride or logistics service?",
      a: "We accept multiple payment options including cash, card, and digital wallets.",
    },
    {
      q: "What if my driver doesn't show up?",
      a: "Our support ensures replacement drivers and refunds if needed.",
    },
    {
      q: "Do you operate 24/7?",
      a: "Yes, our services are available round the clock.",
    },
    {
      q: "How safe are your rides?",
      a: "All drivers are verified and rides are tracked for safety.",
    },
  ];

  return (
    <section className='py-16 px-6 max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-8 text-center'>
        Frequently Asked Questions
      </h2>
      {faqs.map((item, i) => (
        <div key={i} className='border-b py-3'>
          <button
            className='w-full flex justify-between items-center text-left'
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            <span>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className='mt-2 text-gray-600'>{item.a}</p>}
        </div>
      ))}
    </section>
  );
};
