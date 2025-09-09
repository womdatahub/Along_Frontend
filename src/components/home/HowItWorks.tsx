import { HowItWorksHeroIcon } from "@public/svgs";

export const HowItWorks = () => {
  const steps = ["Choose Your Service", "Set Your Details", "Confirm & Ride"];

  return (
    <section className='py-16 px-6 bg-white'>
      <div className='flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto justify-between'>
        <HowItWorksHeroIcon />
        <div className='gap-4'>
          <h2 className='text-4xl font-extrabold'>How It Works</h2>
          <ul className='space-y-3 text-black'>
            {steps.map((step, i) => (
              <li key={i} className='flex items-center text-lg gap-3'>
                {step}
              </li>
            ))}
          </ul>
          <button className='mt-6 bg-primary px-6 py-2 text-white rounded-lg'>
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};
