"use client";

import Link from "next/link";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-125 rounded-[20px] bg-background p-8 flex flex-col gap-5">
        <h1 className="font-heebo text-3xl font-bold text-center">
          Vehicle insurance
        </h1>
        <p className="text-sm text-gray-5">
          Insurance document upload is now part of vehicle registration so the
          backend receives vehicle and insurance information in one validated
          request.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/onboarding/vehicle-info"
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
          >
            Update vehicle info
          </Link>
          <Link
            href="/driver"
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
