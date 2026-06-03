"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  HeadphonesIcon,
} from "lucide-react";

const slides = [
  {
    title: "Lightning Fast",
    subtitle: "Speed",
    description:
      "Instant booking, rapid confirmations, and on-the-dot pickups keep you moving without delay. No waiting, no guessing.",
    img: "/images/young-man.png",
    icon: Zap,
    accent: "#0E696A",
  },
  {
    title: "Safety First",
    subtitle: "Safety",
    description:
      "Your safety is our priority. All drivers are verified, vehicles are maintained to high standards, and every ride is tracked for peace of mind.",
    img: "/images/protected.png",
    icon: Shield,
    accent: "#084B4C",
  },
  {
    title: "Always Here",
    subtitle: "24/7 Support",
    description:
      "Day or night, rain or shine — you can always count on us. Consistency and trust are at the heart of every service we provide.",
    img: "/images/seated-man.png",
    icon: HeadphonesIcon,
    accent: "#0E696A",
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export const Features = () => {
  const [[index, direction], setPage] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = useCallback((newDirection: number) => {
    setPage(([prev]) => {
      const next = (prev + newDirection + slides.length) % slides.length;
      return [next, newDirection];
    });
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => paginate(1), 5000);
  }, [paginate]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const slide = slides[index];
  const Icon = slide.icon;

  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Text side */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {/* Pill tabs */}
            <div className="flex gap-2 flex-wrap">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(([prev]) => [i, i > prev ? 1 : -1]);
                    resetTimer();
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 font-heebo ${
                    i === index
                      ? "bg-primary text-white"
                      : "bg-background text-gray hover:text-primary hover:bg-primaryLight2"
                  }`}
                >
                  {s.subtitle}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primaryLight2">
                  <Icon size={20} className="text-primary" />
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-black font-heebo leading-tight">
                  {slide.title}
                </h2>
                <p className="text-gray text-base md:text-lg font-light leading-relaxed max-w-md">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => {
                  paginate(-1);
                  resetTimer();
                }}
                className="p-2.5 rounded-xl border border-gray-2 hover:border-primary hover:text-primary transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => {
                  paginate(1);
                  resetTimer();
                }}
                className="p-2.5 rounded-xl border border-gray-2 hover:border-primary hover:text-primary transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>
              <div className="flex gap-1.5 ml-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(([prev]) => [i, i > prev ? 1 : -1]);
                      resetTimer();
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-primary" : "w-2 bg-gray-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Image side */}
          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="relative w-72 md:w-80 h-96 md:h-120">
              {/* Decorative backdrop */}
              <div className="absolute inset-4 rounded-3xl translate-x-4 translate-y-4" />
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-3xl overflow-hidden"
                >
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 288px, 320px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
