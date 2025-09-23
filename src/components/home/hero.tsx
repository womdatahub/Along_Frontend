import { LocationIcon } from "@public/svgs";
import { GoogleMapAutoComplete } from "@/components";

export const Hero = () => {
  return (
    <div className='pt-16 w-screen'>
      <section
        className='relative h-[90vh] flex items-end bg-cover bg-center pb-20'
        style={{ backgroundImage: "url('/images/hero-1.png')" }}
      >
        <div className='absolute inset-0 bg-black/40' />
        <div className='flex flex-col  justify-center gap-6 md:gap-16 px-4 md:px-0 max-w-7xl mx-auto text-center w-full mt-24'>
          <div className='relative z-10 text-left text-white'>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>
              Your ride, your ways
            </h1>
            <p className='mb-6 text-xl'>
              Travel on your terms with flexible options, <br /> comfort, and
              control every step of the <br /> journey.
            </p>
          </div>
          <div className='flex gap-4 flex-col text-left md:ml-10 z-10'>
            <p className='text-2xl font-bold text-white'>Make a trip.</p>
            <div className='flex bg-white rounded-lg overflow-hidden gap-4 md:gap-8 justify-between text-black pl-4 md:pl-8'>
              <div className='flex gap-4 md:gap-8 flex-1'>
                <div className='self-center'>
                  <LocationIcon />
                </div>
                <GoogleMapAutoComplete>
                  <input
                    type='text'
                    placeholder='Enter your location'
                    className='flex-1 pt-3 pb-1 outline-none text-gray-700 my-2 md:my-4 border-b border-b-primary min-w-1/2 md:max-w-1/2'
                  />
                </GoogleMapAutoComplete>
              </div>
              <div className='bg-primary px-6 py-2 md:py-6 w-24 h-full rounded-l-none md:w-40 text-white text-2xl hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'>
                Go
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
