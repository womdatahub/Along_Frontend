import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components";

const faqs = [
  {
    q: "How does Along Ride Sharing work?",
    a: "We connect riders in small towns with private drivers traveling through their area. You can book a ride easily via our app or website, choosing a driver heading to your destination.",
  },
  {
    q: "Is it safe to ride with private drivers?",
    a: "Absolutely. All drivers are thoroughly vetted, and rides are tracked in real-time for your safety. We verify licenses, insurance, and run background checks.",
  },
  {
    q: "How can I become a driver?",
    a: "You can sign up on our website or app. We require a valid driver's license, insurance, and a background check to ensure safety for all users.",
  },
  {
    q: "What areas do you serve?",
    a: "We currently operate in numerous small towns and suburban areas around Texas, with plans to expand further. Check our coverage map during booking.",
  },
  {
    q: "Do you offer multilingual support?",
    a: "Yes, our platform supports multiple languages to cater to a diverse user base.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 font-heebo">
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-black font-heebo leading-tight">
            Frequently Asked
            <br />
            Questions
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-2"
          defaultValue={faqs[0].q}
        >
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.q}
              value={faq.q}
              className="border border-gray-2 bg-white rounded-2xl overflow-hidden px-2 font-heebo"
            >
              <AccordionTrigger className="hover:no-underline cursor-pointer px-4 py-4 items-center font-semibold text-sm md:text-base text-left text-black">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-5">
                <p className="text-gray text-sm font-light leading-relaxed">
                  {faq.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
