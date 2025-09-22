import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  HeadingHeebo,
} from "@/components";

export const FAQ = () => {
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
    <section className='py-16 px-6 bg-background-1 overflow-hidden'>
      <div className='flex flex-col gap-10 max-w-4xl mx-auto relative'>
        <HeadingHeebo className='text-4xl font-extrabold text-left'>
          Frequently Asked Questions
        </HeadingHeebo>
        <Accordion
          type='single'
          collapsible
          className='w-full flex flex-col gap-1'
          defaultValue='item-1'
        >
          {faqs.map((faq, i) => {
            return (
              <AccordionItem
                key={i}
                value={faq.q}
                className='border-b-0 bg-white font-heebo text-lg'
              >
                <AccordionTrigger className='hover:no-underline cursor-pointer p-4 items-center bg-[#F9F9F9] font-medium '>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-10 p-4'>
                  <p>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};
