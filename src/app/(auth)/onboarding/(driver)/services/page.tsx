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
    <div className='flex justify-center items-center h-full px-4 md:px-0'>
      <div className='flex flex-col gap-10 rounded-[20px] max-w-[500px] px-4 md:px-8 py-6 md:py-10 bg-background-1 text-black'>
        <div className='flex flex-col gap-2'>
          <HeadingHeebo>Offered services</HeadingHeebo>
          <p className='text-center text-sm'>
            Please select a service (s) you are interested in
          </p>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            {servicesItems.map((service) => {
              return (
                <button
                  disabled={service.isComingSoon}
                  key={service.state}
                  onClick={() => {
                    if (service.isComingSoon) return;
                    toggleOption(service.state);
                  }}
                  className={cn(
                    "flex gap-4 justify-between items-center px-4 py-7 bg-white cursor-pointer transition-colors duration-500 last:rounded-b-2xl first:rounded-t-2xl",
                    service.isComingSoon && "cursor-not-allowed",
                  )}
                >
                  <div className='flex flex-1 items-center justify-between gap-5'>
                    <div className='flex gap-4 items-center'>
                      <Image
                        src={service.img}
                        alt={service.state}
                        width={40}
                        height={40}
                      />
                      <p className='font-medium text-xs'>{service.title}</p>
                    </div>
                    {service.isComingSoon && (
                      <p className='font-bold text-xs text-red-600 animate-pulse'>
                        Coming Soon
                      </p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "size-4 bg-primaryLight",
                      services.includes(service.state) && "bg-primary",
                    )}
                  />
                </button>
              );
            })}
            <div className='flex justify-between items-center gap-3 px-4 mt-3'>
              <p>Select all</p>
              <div
                onClick={() =>
                  setServices(
                    servicesItems
                      .filter((service) => !service.isComingSoon)
                      .map((service) => service.state),
                  )
                }
                className={cn(
                  "size-4 bg-primaryLight cursor-pointer",
                  services.length === 3 && "bg-primary",
                )}
              />
            </div>
          </div>
        </div>
        <AuthBackAndContinueButton
          backActive
          continueActive={services.length > 0}
          continueFnc={async () => {
            router.push("/onboarding/documents");
          }}
        />
      </div>
    </div>
  );
};
export default Page;

const servicesItems = [
  {
    state: "rental",
    title: "Ride Rental",
    img: "/images/rental.png",
    isComingSoon: false,
  },
  {
    state: "scheduled",
    title: "Scheduled Ride",
    img: "/images/scheduled.png",
    isComingSoon: true,
  },
  {
    state: "logistics",
    title: "Logistics",
    img: "/images/logistics.png",
    isComingSoon: true,
  },
];
