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
      q: "How does Along Ride Sharing work?",
      a: "We connect riders in small towns with private drivers traveling through their area. You can book a ride easily via our app or website, choosing a driver heading to your destination.",
    },
    {
      q: " Is it safe to ride with private drivers?",
      a: "Absolutely. All drivers are thoroughly vetted, and rides are tracked in real-time for your safety.",
    },
    {
      q: "How can I become a driver?",
      a: "You can sign up on our website or app. We require a valid driver's license, insurance, and a background check to ensure safety for all users.",
    },
    {
      q: "What areas do you serve?",
      a: "We currently operate in numerous small towns and suburban areas across the United States, with plans to expand further.",
    },
    {
      q: "Do you offer multilingual support?",
      a: "Yes, our platform supports multiple languages to cater to a diverse user base.",
    },
  ];

  return (
    <section className='py-16 px-6 bg-background-1 overflow-hidden'>
      <div className='flex flex-col gap-10 max-w-4xl mx-auto relative'>
        <HeadingHeebo className='text-2xl md:text-4xl font-extrabold text-left'>
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
