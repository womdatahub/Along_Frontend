"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Service",
    description:
      "Pick the ride option that fits your trip — whether it's a quick hop across town or a comfortable ride for longer journeys.",
    image: "/images/how-it-works-1.png",
  },
  {
    number: "02",
    title: "Set Your Details",
    description:
      "Enter your pickup location, destination, and ride preferences to get matched with the perfect driver.",
    image: "/images/how-it-works-2.png",
  },
  {
    number: "03",
    title: "Confirm & Ride",
    description:
      "Review your details, confirm the ride, and enjoy a safe and reliable trip with our professional drivers.",
    image: "/images/how-it-works-3.png",
  },
];

export const HowItWorks = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextStep = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextStep, 5000);
  }, [nextStep]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const activeStep = steps[activeIndex];

  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
          {/* Text side */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 font-heebo">
                How It Works
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-black font-heebo leading-tight">
                Three steps
                <br />
                to your ride
              </h2>
            </div>

            {/* Step list */}
            <div className="flex flex-col gap-2">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    resetTimer();
                  }}
                  className={`flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? "bg-primaryLight2/50 border border-primaryLight2"
                      : "hover:bg-background"
                  }`}
                >
                  <span
                    className={`text-xs font-bold font-heebo shrink-0 mt-0.5 transition-colors duration-300 ${
                      i === activeIndex ? "text-primary" : "text-gray"
                    }`}
                  >
                    {step.number}
                  </span>
                  <div>
                    <p
                      className={`font-semibold font-heebo text-sm mb-1 transition-colors duration-300 ${
                        i === activeIndex ? "text-primary-deep" : "text-gray-4"
                      }`}
                    >
                      {step.title}
                    </p>
                    <AnimatePresence>
                      {i === activeIndex && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="text-gray text-sm font-light leading-relaxed overflow-hidden"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-gray-2 rounded-full overflow-hidden">
              <motion.div
                key={activeIndex}
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>

            <Link
              href={"/rent-ride"}
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3.5 rounded-2xl hover:bg-primary-deep transition-colors duration-200 self-start"
            >
              Book now
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Image side */}
          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 md:w-80 h-80 md:h-120">
              {/* Background decoration */}
              <div className="absolute inset-0 rounded-4xl bg-background translate-x-5 translate-y-5" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.image}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-4xl overflow-hidden"
                >
                  <Image
                    src={activeStep.image}
                    alt={activeStep.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Step badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-2"
                >
                  <p className="text-xs text-gray font-medium">Step</p>
                  <p className="text-2xl font-bold text-primary font-heebo">
                    {activeStep.number}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
