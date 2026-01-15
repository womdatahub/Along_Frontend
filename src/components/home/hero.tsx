"use client";
import { LocationIcon } from "@public/svgs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  HeadingHeebo,
  RadarAutocomplete,
  ServiceDialog,
  // radarAutocompleteManual,
} from "@/components";
import { Suspense } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib";
import { useRadarMap } from "@/store";
import { modalItems, nonModalItems } from "@/lib";

export const Hero = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};
const Page = () => {
  // const [destination, setDestination] = useState<string>("");
  // console.log(destination);

  const searchParams = useSearchParams();
  const router = useRouter();

  const service = searchParams.get("service");

  const {
    autoCompleteAddress,
    actions: { setAutoCompleteAddress },
  } = useRadarMap((state) => state);

  return (
    <div className='pt-16 w-screen'>
      <section
        className='relative h-[90vh] flex items-end bg-cover bg-center pb-20'
        style={{ backgroundImage: "url('/images/hero-1.png')" }}
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
                  {/* <input
                    name='destination'
                    type='text'
                    placeholder='Enter your destination'
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      radarAutocompleteManual(e.target.value);
                    }}
                  /> */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger
                  asChild
                  disabled={autoCompleteAddress === undefined}
                >
                  <Button className='bg-primary px-6 md:px-6 py-4 md:py-6 w-fit h-full rounded-l-none md:w-40 text-white text-base md:text-2xl hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'>
                    Go
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className='sm:max-w-[425px] p-0 bg-background-1'
                  showCloseButton={false}
                >
                  <VisuallyHidden>
                    <DialogTitle>
                      Please select a service (s) you are interested in
                    </DialogTitle>
                  </VisuallyHidden>
                  <div className='flex flex-col gap-10 rounded-[20px] px-8 py-10 text-black'>
                    <div className='flex flex-col gap-2'>
                      <HeadingHeebo>Offered services</HeadingHeebo>
                      <p className='text-center text-sm'>
                        Please select a service (s) you are interested in
                      </p>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col gap-1'>
                        {modalItems.map((item, i) => {
                          return (
                            <ServiceDialog
                              key={i}
                              trigger={
                                <button
                                  key={item.state}
                                  onClick={() => {
                                    if (item.state === "scheduled") {
                                      router.push("/schedule-ride");
                                      return;
                                    }
                                    router.push(
                                      `?service=${item.state.toLowerCase()}`
                                    );
                                  }}
                                  className={cn(
                                    "flex gap-4 justify-between items-center px-4 py-7 hover:bg-primary/70 hover:text-white bg-white cursor-pointer transition-colors duration-500 rounded-2xl",
                                    service === item.state &&
                                      "bg-primary/70 text-white"
                                  )}
                                >
                                  <div className='flex gap-4 items-center'>
                                    <Image
                                      src={item.img}
                                      alt={item.state}
                                      width={40}
                                      height={40}
                                    />
                                    <p className='font-medium text-xs'>
                                      {item.title}
                                    </p>
                                  </div>
                                </button>
                              }
                            />
                          );
                        })}
                        {nonModalItems.map((item) => {
                          return (
                            <button
                              key={item.state}
                              disabled={item.disabled}
                              onClick={() => {
                                if (item.state === "scheduled") {
                                  router.push("/schedule-ride");
                                  return;
                                }
                              }}
                              className={cn(
                                "disabled:cursor-not-allowed flex gap-4 justify-between items-center px-4 py-7 hover:bg-primary/70 hover:text-white bg-white cursor-pointer transition-colors duration-500 rounded-2xl",
                                service === item.state &&
                                  "bg-primary/70 text-white"
                              )}
                            >
                              <div className='flex gap-4 items-center'>
                                <Image
                                  src={item.img}
                                  alt={item.state}
                                  width={40}
                                  height={40}
                                />
                                <p className='font-medium text-xs'>
                                  {item.title}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
