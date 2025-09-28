"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

const slides = [
  {
    title: "Fast",
    description:
      "Instant booking, rapid confirmations, and on-the-dot pickups keep you moving without delay.",
    img: "/images/young-man.png",
  },
  {
    title: "Safety",
    description:
      "Your safety is our priority. All our drivers are verified, vehicles are maintained to high standards, and rides are tracked for extra peace of mind.",
    img: "/images/protected.png",
  },
  {
    title: "24/7 Support",
    description:
      "Day or night, rain or shine—you can always count on us. Consistency and trust are at the heart of every service we provide.",
    img: "/images/seated-man.png",
  },
];

export const Features = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handleSlide = (nextIndex: number, dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setAnimating(false);
    }, 400); // Match animation duration
  };

  const handlePrev = () => {
    const nextIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    handleSlide(nextIndex, "left");
  };

  const handleNext = () => {
    const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    handleSlide(nextIndex, "right");
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className='pt-36 pb-16 px-6 bg-white relative overflow-hidden'>
      <div className='relative h-[400px] max-w-6xl mx-auto flex items-center justify-center'>
        <button
          onClick={handlePrev}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 rotate-180 transition cursor-pointer'
        >
          <svg
            width={14}
            height={18}
            viewBox='0 0 14 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.38061 0.153104C1.04369 -0.068301 0.522992 -0.0461605 0.216701 0.197385C-0.0895907 0.440931 -0.0589624 0.817319 0.277958 1.03872L12.1315 8.7879C12.4377 8.98716 12.4377 9.27499 12.1315 9.47425L0.27796 16.9577C-0.058961 17.1791 -0.0895882 17.5555 0.186074 17.7991C0.492366 18.0426 1.01306 18.0648 1.34998 17.8655L13.2035 10.3599C14.2449 9.69565 14.2755 8.58863 13.2341 7.90228L1.38061 0.153104Z'
              fill='black'
              fillOpacity={0.5}
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10  transition cursor-pointer'
        >
          <svg
            width={14}
            height={18}
            viewBox='0 0 14 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.38061 0.153104C1.04369 -0.068301 0.522992 -0.0461605 0.216701 0.197385C-0.0895907 0.440931 -0.0589624 0.817319 0.277958 1.03872L12.1315 8.7879C12.4377 8.98716 12.4377 9.27499 12.1315 9.47425L0.27796 16.9577C-0.058961 17.1791 -0.0895882 17.5555 0.186074 17.7991C0.492366 18.0426 1.01306 18.0648 1.34998 17.8655L13.2035 10.3599C14.2449 9.69565 14.2755 8.58863 13.2341 7.90228L1.38061 0.153104Z'
              fill='black'
              fillOpacity={0.5}
            />
          </svg>
        </button>
        <div
          key={currentIndex}
          className={clsx(
            "flex gap-20 items-center justify-between w-full max-w-5xl px-4 absolute transition-all duration-400",
            direction === "right" && animating && "animate-slide-out-left",
            direction === "left" && animating && "animate-slide-out-right",
            !animating &&
              (direction === "right"
                ? "animate-slide-in-from-right"
                : "animate-slide-in-from-left")
          )}
        >
          <div className='flex flex-col gap-4 text-left w-full md:w-1/2'>
            <h2 className='text-4xl font-extrabold text-black'>
              {currentSlide.title}
            </h2>
            <p className='text-black font-light text-xl'>
              {currentSlide.description}
            </p>
          </div>
          <Image
            src={currentSlide.img}
            alt={currentSlide.description}
            width={237}
            height={337}
          />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0%);
          }
        }

        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0%);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0%);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.4s ease forwards;
        }

        .animate-slide-out-left {
          animation: slideOutLeft 0.4s ease forwards;
        }

        .animate-slide-out-right {
          animation: slideOutRight 0.4s ease forwards;
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0%);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0%);
          }
        }

        .animate-slide-in-from-right {
          animation: slideInFromRight 0.4s ease forwards;
        }

        .animate-slide-in-from-left {
          animation: slideInFromLeft 0.4s ease forwards;
        }
      `}</style>
    </section>
  );
};
