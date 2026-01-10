"use client";
import { AuthBackAndContinueButton } from "@/components";
import { HeadingHeebo } from "@/components";
import { cn } from "@/lib";
import { useSession } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const {
    services,
    actions: { setServices },
  } = useSession((state) => state);

  const router = useRouter();

  const toggleOption = (option: string) => {
    if (services.includes(option)) {
      setServices(services.filter((opt) => opt !== option));
    } else {
      setServices([...services, option]);
    }
  };
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Offered services</HeadingHeebo>
        <p className='text-center text-sm'>
          Please select a service (s) you are interested in
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          {items.map((item) => {
            return (
              <button
                key={item.state}
                onClick={() => {
                  toggleOption(item.state);
                }}
                className={cn(
                  "flex gap-4 justify-between items-center px-4 py-7 bg-white cursor-pointer transition-colors duration-500 last:rounded-b-2xl first:rounded-t-2xl"
                )}
              >
                <div className='flex gap-4 items-center'>
                  <Image
                    src={item.img}
                    alt={item.state}
                    width={40}
                    height={40}
                  />
                  <p className='font-medium text-xs'>{item.title}</p>
                </div>
                <div
                  className={cn(
                    "size-4 bg-primaryLight",
                    services.includes(item.state) && "bg-primary"
                  )}
                />
              </button>
            );
          })}
          <div className='flex justify-between items-center gap-3 px-4 mt-3'>
            <p>Select all</p>
            <div
              onClick={() => setServices(items.map((i) => i.state))}
              className={cn(
                "size-4 bg-primaryLight cursor-pointer",
                services.length === 3 && "bg-primary"
              )}
            />
          </div>
        </div>
      </div>
      <AuthBackAndContinueButton
        backActive
        continueActive={services.length > 0}
        continueFnc={() => {
          router.push("/onboarding/driver-info");
        }}
        // continuePath='/onboarding/driver-info'
      />
    </div>
  );
};
export default Page;

const items = [
  {
    state: "rental",
    title: "Ride Rental",
    img: "/images/rental.png",
  },
  {
    state: "scheduled",
    title: "Scheduled Ride",
    img: "/images/scheduled.png",
  },
  {
    state: "logistics",
    title: "Logistics",
    img: "/images/logistics.png",
  },
];
