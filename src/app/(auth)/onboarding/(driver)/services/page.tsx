"use client";
import { AuthBackAndContinueButton } from "@/components";
import { cn } from "@/lib";
import { useSession } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

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

  const availableServices = servicesItems.filter((s) => !s.isComingSoon);

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Offered services
          </h1>
          <p className="text-gray text-sm font-light">
            Select the services you want to offer
          </p>
        </div>

        <div className="bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm flex flex-col gap-6">
          {/* Step badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-2 w-fit">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-gray-4">Step 2 of 4</span>
          </div>

          <div className="flex flex-col gap-2">
            {servicesItems.map((service) => (
              <button
                disabled={service.isComingSoon}
                key={service.state}
                onClick={() => {
                  if (service.isComingSoon) return;
                  toggleOption(service.state);
                }}
                className={cn(
                  "flex gap-4 items-center px-4 py-4 rounded-2xl bg-white transition-all duration-200 cursor-pointer border-2 text-left",
                  service.isComingSoon && "cursor-not-allowed opacity-60",
                  !service.isComingSoon && services.includes(service.state)
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-gray-2",
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shrink-0">
                  <Image
                    src={service.img}
                    alt={service.state}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-black font-heebo">
                    {service.title}
                  </p>
                  {service.isComingSoon && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-gray" />
                      <p className="text-xs text-gray font-light">
                        Coming soon
                      </p>
                    </div>
                  )}
                </div>
                {!service.isComingSoon && (
                  <div
                    className={cn(
                      "size-5 rounded-full border-2 shrink-0 transition-all duration-200 flex items-center justify-center",
                      services.includes(service.state)
                        ? "border-primary bg-primary"
                        : "border-gray-2",
                    )}
                  >
                    {services.includes(service.state) && (
                      <div className="size-2 rounded-full bg-white" />
                    )}
                  </div>
                )}
              </button>
            ))}

            {/* Select all */}
            <button
              onClick={() => setServices(availableServices.map((s) => s.state))}
              className="flex justify-between items-center gap-3 px-4 py-3 mt-1 rounded-xl hover:bg-white transition-colors duration-200"
            >
              <p className="text-sm font-medium text-gray-4">
                Select all available
              </p>
              <div
                className={cn(
                  "size-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  services.length === availableServices.length
                    ? "border-primary bg-primary"
                    : "border-gray-2",
                )}
              >
                {services.length === availableServices.length && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
            </button>
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
