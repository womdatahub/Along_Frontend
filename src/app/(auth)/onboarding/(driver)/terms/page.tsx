"use client";

import { Button } from "@/components";
import { useRouter } from "next/navigation";

const terms = [
  {
    title: "Driver eligibility",
    body: "You must provide accurate identity, license, verification, vehicle, and insurance information. Along may restrict rental availability until verification is reviewed and approved.",
  },
  {
    title: "Vehicle rental services",
    body: "Rental listings must represent vehicles you are authorized to operate or list. You are responsible for keeping vehicle details, pickup location, availability, and rental mode support accurate.",
  },
  {
    title: "With-driver rentals",
    body: "When accepting with-driver rentals, you agree to drive safely, arrive at the agreed pickup location, and follow local transport, insurance, and safety obligations.",
  },
  {
    title: "Self-drive rentals",
    body: "Self-drive rentals may be booked only by riders who satisfy Along eligibility checks. You must not bypass platform checks or settle payments outside Along.",
  },
  {
    title: "Payments and disputes",
    body: "Rental payments are processed through the platform. Payment confirmation depends on the payment processor webhook, and payout timing may depend on Stripe account status and compliance review.",
  },
];

const Page = () => {
  const router = useRouter();
  return (
    <div className="flex w-full max-w-140 flex-col gap-4 overflow-y-auto text-black font-fustat">
      <p className="font-bold text-xl text-center sticky top-0 bg-white pb-2">
        Driver Terms and Conditions
      </p>
      <div className="flex flex-col gap-4 text-sm">
        {terms.map((term) => (
          <section key={term.title} className="flex flex-col gap-1">
            <p className="font-bold text-lg">{term.title}</p>
            <p className="text-gray-5">{term.body}</p>
          </section>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="link"
          className="text-black font-bold hover:cursor-pointer"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          variant="link"
          className="text-primary font-bold hover:cursor-pointer"
          onClick={() => router.push("/onboarding/driver-info")}
        >
          Accept
        </Button>
      </div>
    </div>
  );
};

export default Page;
