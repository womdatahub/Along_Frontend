// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components";

// export const HowItWorks = () => {
//   const steps = [
//     {
//       title: "Choose Your Service",
//       description:
//         "Pick the ride option that best fits your trip—whether it’s a quick hop across town or a more comfortable ride for longer journeys.",
//       image: "/images/how-it-works-1.png",
//     },
//     {
//       title: "Set Your Details",
//       description:
//         "Enter your pickup location, destination, and ride preferences to get matched with the perfect driver.",
//       image: "/images/how-it-works-2.png",
//     },
//     {
//       title: "Confirm & Ride",
//       description:
//         "Review your details, confirm the ride, and enjoy a safe and reliable trip with our professional drivers.",
//       image: "/images/how-it-works-3.png",
//     },
//   ];

//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % steps.length);
//     }, 3000); // change every 3s
//     return () => clearInterval(interval);
//   }, [steps.length]);

//   const activeStep = steps[activeIndex];

//   return (
//     <section className='py-16 px-6 bg-white'>
//       <div className='flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto'>
//         <div className='relative w-96 h-[576px]'>
//           <Image
//             key={activeStep.image}
//             src={activeStep.image}
//             alt={activeStep.title}
//             width={384}
//             height={576}
//             className='object-cover rounded-xl transition-opacity duration-700 ease-in-out'
//           />
//         </div>

//         <div className='flex flex-col gap-6'>
//           <h2 className='text-4xl font-extrabold'>How It Works</h2>

//           <div
//             key={activeStep.title}
//             className='flex flex-col gap-1 font-heebo font-light text-lg w-full md:w-1/2 transition-opacity duration-700 ease-in-out'
//           >
//             <p className='font-bold'>{activeStep.title}</p>
//             <p>{activeStep.description}</p>
//           </div>

//           <Button className='bg-primary px-6 py-2 text-white rounded-lg'>
//             Book Now
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components";
// import { motion, AnimatePresence } from "framer-motion";

// export const HowItWorks = () => {
//   const steps = [
//     {
//       title: "Choose Your Service",
//       description:
//         "Pick the ride option that best fits your trip—whether it’s a quick hop across town or a more comfortable ride for longer journeys.",
//       image: "/images/how-it-works-1.png",
//     },
//     {
//       title: "Set Your Details",
//       description:
//         "Enter your pickup location, destination, and ride preferences to get matched with the perfect driver.",
//       image: "/images/how-it-works-2.png",
//     },
//     {
//       title: "Confirm & Ride",
//       description:
//         "Review your details, confirm the ride, and enjoy a safe and reliable trip with our professional drivers.",
//       image: "/images/how-it-works-3.png",
//     },
//   ];

//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % steps.length);
//     }, 3000); // change every 3s
//     return () => clearInterval(interval);
//   }, [steps.length]);

//   const activeStep = steps[activeIndex];

//   return (
//     <section className='py-16 px-6 bg-white overflow-hidden'>
//       <div className='flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto'>
//         {/* IMAGE */}
//         <div className='relative w-96 h-[576px] overflow-hidden'>
//           <AnimatePresence mode='wait'>
//             <motion.div
//               key={activeStep.image}
//               initial={{ x: "100%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "-100%", opacity: 0 }}
//               transition={{ duration: 0.6, ease: "easeInOut" }}
//               className='absolute w-full h-full'
//             >
//               <Image
//                 src={activeStep.image}
//                 alt={activeStep.title}
//                 width={384}
//                 height={576}
//                 className='object-cover rounded-xl w-full h-full'
//               />
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* TEXT */}
//         <div className='flex flex-col gap-6 w-full md:w-1/2'>
//           <h2 className='text-4xl font-extrabold'>How It Works</h2>

//           <div className='relative h-32'>
//             <AnimatePresence mode='wait'>
//               <motion.div
//                 key={activeStep.title}
//                 initial={{ x: "100%", opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: "-100%", opacity: 0 }}
//                 transition={{ duration: 0.6, ease: "easeInOut" }}
//                 className='absolute w-full'
//               >
//                 <p className='font-bold'>{activeStep.title}</p>
//                 <p className='font-heebo font-light text-lg'>
//                   {activeStep.description}
//                 </p>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           <Button className='bg-primary px-6 py-2 text-white rounded-lg'>
//             Book Now
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import Image from "next/image";
// import { Button } from "@/components";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export const HowItWorks = () => {
//   const steps = [
//     {
//       title: "Choose Your Service",
//       description:
//         "Pick the ride option that best fits your trip—whether it’s a quick hop across town or a more comfortable ride for longer journeys.",
//       image: "/images/how-it-works-1.png",
//     },
//     {
//       title: "Set Your Details",
//       description:
//         "Enter your pickup location, destination, and ride preferences to get matched with the perfect driver.",
//       image: "/images/how-it-works-2.png",
//     },
//     {
//       title: "Confirm & Ride",
//       description:
//         "Review your details, confirm the ride, and enjoy a safe and reliable trip with our professional drivers.",
//       image: "/images/how-it-works-3.png",
//     },
//   ];

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   const nextStep = useCallback(() => {
//     setActiveIndex((prev) => (prev + 1) % steps.length);
//   }, [steps.length]);

//   const prevStep = useCallback(() => {
//     setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
//   }, [steps.length]);

//   // Resettable autoplay
//   const resetTimer = useCallback(() => {
//     if (timer) clearInterval(timer);
//     const newTimer = setInterval(() => {
//       nextStep();
//     }, 5000); // 5 seconds
//     setTimer(newTimer);
//   }, [nextStep]);

//   useEffect(() => {
//     resetTimer();
//     return () => {
//       if (timer) clearInterval(timer);
//     };
//   }, []);

//   const activeStep = steps[activeIndex];

//   return (
//     <section className='py-16 px-6 bg-white overflow-hidden'>
//       <div className='flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto relative'>
//         {/* IMAGE */}
//         <div className='relative w-96 h-[576px] overflow-hidden'>
//           <AnimatePresence mode='wait'>
//             <motion.div
//               key={activeStep.image}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1, ease: "easeInOut" }}
//               className='absolute w-full h-full'
//             >
//               <Image
//                 src={activeStep.image}
//                 alt={activeStep.title}
//                 width={384}
//                 height={576}
//                 className='object-cover rounded-xl w-full h-full'
//               />
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* TEXT */}
//         <div className='flex flex-col gap-6 w-full md:w-1/2'>
//           <h2 className='text-4xl font-extrabold'>How It Works</h2>

//           <div className='relative h-32'>
//             <AnimatePresence mode='wait'>
//               <motion.div
//                 key={activeStep.title}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 1, ease: "easeInOut" }}
//                 className='absolute w-full'
//               >
//                 <p className='font-bold'>{activeStep.title}</p>
//                 <p className='font-heebo font-light text-lg'>
//                   {activeStep.description}
//                 </p>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           <Button className='bg-primary px-6 py-2 text-white rounded-lg'>
//             Book Now
//           </Button>
//         </div>

//         {/* NAVIGATION ARROWS */}
//         <button
//           onClick={() => {
//             prevStep();
//             resetTimer();
//           }}
//           className='absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100'
//         >
//           <ChevronLeft size={24} />
//         </button>

//         <button
//           onClick={() => {
//             nextStep();
//             resetTimer();
//           }}
//           className='absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100'
//         >
//           <ChevronRight size={24} />
//         </button>
//       </div>
//     </section>
//   );
// };

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components";
import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Choose Your Service",
      description:
        "Pick the ride option that best fits your trip—whether it’s a quick hop across town or a more comfortable ride for longer journeys.",
      image: "/images/how-it-works-1.png",
    },
    {
      title: "Set Your Details",
      description:
        "Enter your pickup location, destination, and ride preferences to get matched with the perfect driver.",
      image: "/images/how-it-works-2.png",
    },
    {
      title: "Confirm & Ride",
      description:
        "Review your details, confirm the ride, and enjoy a safe and reliable trip with our professional drivers.",
      image: "/images/how-it-works-3.png",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextStep = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  }, [steps.length]);

  // const prevStep = useCallback(() => {
  //   setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  // }, [steps.length]);

  // Clear + restart autoplay
  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextStep();
    }, 5000); // 5s each slide
  }, [nextStep]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const activeStep = steps[activeIndex];

  return (
    <section className='py-16 px-6 bg-white overflow-hidden'>
      <div className='flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto relative'>
        {/* IMAGE */}
        <div className='relative w-96 h-[576px] overflow-hidden'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeStep.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className='absolute w-full h-full'
            >
              <Image
                src={activeStep.image}
                alt={activeStep.title}
                width={400}
                height={576}
                className='object-cover rounded-[39px] w-full h-full'
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* TEXT */}
        <div className='flex flex-col gap-6 w-2/3'>
          <h2 className='text-4xl font-extrabold'>How It Works</h2>

          <div className='relativ'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeStep.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className='w-full flex flex-col gap-1 font-heebo font-light text-lg md:w-2/3 transition-opacity duration-700 ease-in-out'
              >
                <p className='font-bold'>{activeStep.title}</p>
                <p className='font-heebo font-light text-lg'>
                  {activeStep.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <Button className='bg-primary px-6 py-2 text-white rounded-lg'>
            Book Now
          </Button>
        </div>

        {/* <button
          onClick={() => {
            prevStep();
            resetTimer();
          }}
          className='absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100'
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => {
            nextStep();
            resetTimer();
          }}
          className='absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100'
        >
          <ChevronRight size={24} />
        </button> */}
      </div>
    </section>
  );
};
