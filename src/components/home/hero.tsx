"use client";
import { LocationIcon } from "@public/svgs";
import {
  Button,
  CompleteHeroServiceDialog,
  RadarAutocomplete,
} from "@/components";
import { Suspense, useState, useEffect } from "react";
import { useRadarMap } from "@/store";
import { useShallow } from "zustand/shallow";

const HERO_IMAGE = "/images/hero-1.png";

export const Hero = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};

const Page = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Preload the hero image so the section never disappears while waiting
  useEffect(() => {
    const img = new Image();
    img.src = HERO_IMAGE;
    img.onload = () => setIsImageLoaded(true);

    // If image is already cached, onload fires synchronously
    if (img.complete) setIsImageLoaded(true);
  }, []);

  const {
    autoCompleteAddress,
    actions: { setAutoCompleteAddress },
  } = useRadarMap(
    useShallow((state) => ({
      autoCompleteAddress: state.autoCompleteAddress,
      actions: state.actions,
    })),
  );

  return (
    <div className='pt-16 w-screen'>
      <section
        className='relative h-[90vh] flex items-end bg-cover bg-center pb-20 transition-opacity duration-700'
        style={{
          backgroundColor: "#1a1a2e",
          backgroundImage: isImageLoaded ? `url('${HERO_IMAGE}')` : "none",
          opacity: isImageLoaded ? 1 : 0.85,
        }}
      >
        <div className='absolute inset-0 bg-black/40' />
        <div className='flex flex-col  justify-center gap-6 md:gap-16 px-4 md:px-0 max-w-7xl mx-auto text-center w-full mt-24'>
          <div className='relative z-10 text-left text-white'>
            <h1 className='text-3xl md:text-6xl font-bold mb-4'>
              Your ride, your ways
            </h1>
            <p className='mb-6 text-lg md:text-xl'>
              Travel on your terms with flexible options, <br /> comfort, and
              control every step of the <br /> journey.
            </p>
          </div>
          <div className='flex gap-4 flex-col text-left md:ml-10 z-10'>
            <p className='text-2xl font-bold text-white'>Make a trip.</p>
            <div className='flex bg-white rounded-lg overflow- gap-2 md:gap-8 justify-between text-black pl-2 md:pl-8'>
              <div className='flex gap-2 md:gap-8 flex-1'>
                <div className='self-center'>
                  <LocationIcon />
                </div>
                <div className='flex-1 pt-3 pb-1 outline-none text-gray-700 my-2 md:my-4 border-b border-b-primary min-w-1/2 md:max-w-1/2'>
                  <RadarAutocomplete
                    setAutoCompleteAddress={setAutoCompleteAddress}
                    placeholder='Enter your location'
                    defaultValue={
                      autoCompleteAddress &&
                      `${autoCompleteAddress?.formattedAddress}`
                    }
                  />
                </div>
              </div>

              <CompleteHeroServiceDialog
                trigger={
                  <Button className='bg-primary px-6 md:px-6 py-5 md:py-6 w-fit h-full rounded-l-none md:w-40 text-white text-base md:text-2xl hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'>
                    Go
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
