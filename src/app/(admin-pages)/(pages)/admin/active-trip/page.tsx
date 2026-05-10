import Link from "next/link";

const Page = () => {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl md:text-4xl font-heebo">Active trips</p>
        <span className="w-fit rounded-full bg-primaryLight2 px-3 py-1 text-xs font-bold text-primary">
          Ride dispatch coming soon
        </span>
      </div>
      <div className="rounded-2xl bg-white p-6 md:p-8">
        <div className="grid md:grid-cols-[auto_1fr] gap-5 items-start">
          <div className="size-14 rounded-full bg-primaryLight2 text-primary flex items-center justify-center">
            <span className="font-bold">RT</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-bold text-xl">
                No active ride trips to monitor
              </p>
              <p className="text-sm text-gray-5 mt-1">
                Ride-hailing dispatch, route playback, and live trip termination
                controls are inactive until ride services are enabled. Vehicle
                rental operations remain available.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {["Dispatch", "Route playback", "Live tracking"].map((item) => (
                <div key={item} className="rounded-2xl bg-background-1 p-4">
                  <p className="font-bold">{item}</p>
                  <p className="text-gray-5">Unavailable</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/admin/drivers-and-fleets"
                className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
              >
                Review drivers
              </Link>
              <Link
                href="/admin/market-place"
                className="rounded-full bg-background-1 px-4 py-2 text-sm font-bold text-black"
              >
                Marketplace settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
