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
import { motion } from "framer-motion";

const HERO_IMAGE = "/images/hero-1.png";

export const Hero = () => (
  <Suspense fallback={<div className="h-screen bg-primary-deep" />}>
    <HeroPage />
  </Suspense>
);

const HeroPage = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = HERO_IMAGE;
    const handleLoad = () => queueMicrotask(() => setIsImageLoaded(true));
    img.onload = handleLoad;
    if (img.complete) handleLoad();
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
    <div className="w-full pt-18 overflow-hidden">
      <section
        className="relative min-h-[92vh] flex items-end bg-cover bg-center"
        style={{
          backgroundColor: "#0b2222",
          backgroundImage: isImageLoaded ? `url('${HERO_IMAGE}')` : "none",
          backgroundPosition: "center 20%",
        }}
      >
        {/* Layered overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pb-16 md:pb-24">
          {/* Headline */}
          <div className="mb-10 md:mb-14">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-white/70 text-sm font-medium tracking-widest uppercase mb-4 font-heebo"
            >
              Flexible Vehicle Rentals
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="text-white text-4xl md:text-6xl lg:text-7xl font-bold font-heebo leading-[1.05] tracking-tight max-w-2xl"
            >
              Your ride,
              <br />
              your way.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
              className="mt-4 text-white/75 text-lg md:text-xl max-w-md font-light"
            >
              Travel on your terms — flexible options,
              <br className="hidden md:block" /> comfort, and control at every
              step.
            </motion.p>
          </div>

          {/* Search widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <p className="text-white/80 text-base font-semibold mb-3 font-heebo">
              Where are you going?
            </p>
            <div className="flex items-stretch bg-white rounded-2xl shadow-2xl max-w-xl">
              <div className="flex items-center gap-3 flex-1 pl-4 pr-2">
                <div className="shrink-0 text-primary">
                  <LocationIcon />
                </div>
                <div className="flex-1 py-3.5 text-gray-700">
                  <RadarAutocomplete
                    setAutoCompleteAddress={setAutoCompleteAddress}
                    placeholder="Enter your location"
                    defaultValue={
                      autoCompleteAddress
                        ? `${autoCompleteAddress.formattedAddress}`
                        : undefined
                    }
                  />
                </div>
              </div>
              <CompleteHeroServiceDialog
                trigger={
                  <Button className="bg-primary hover:bg-primary-deep text-white font-semibold px-6 md:px-8 py-3.5 h-auto rounded-2xl rounded-l-none text-base transition-colors duration-200 cursor-pointer">
                    Go
                  </Button>
                }
              />
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.65 }}
            className="mt-8 flex items-center gap-6 flex-wrap"
          >
            {["Verified drivers", "Flexible booking", "24/7 support"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-lightgreen" />
                  <span className="text-white/70 text-sm font-medium">
                    {item}
                  </span>
                </div>
              ),
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
