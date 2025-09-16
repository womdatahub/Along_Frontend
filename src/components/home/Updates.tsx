import { HeadingHeebo } from "@/components";
export const Updates = () => {
  const updates = [
    { title: "Update Alert", img: "/images/horizon-2.png" },
    { title: "Update Alert", img: "/images/horizon-2.png" },
    { title: "Update Alert", img: "/images/horizon-2.png" },
  ];

  return (
    <section className='px-6 pb-24 bg-white text-black'>
      <div className='flex flex-col gap-4 max-w-6xl mx-auto'>
        <div className='flex gap-2 flex-col font-heebo font-light text-lg'>
          <HeadingHeebo className='text-left'>On the Horizon</HeadingHeebo>
          <p className='w-2/3'>
            Stay in the know with what’s next. From new features and service
            updates to fresh insights, our “Upcoming” section keeps you ahead of
            the curve. Discover what we’re building, improvements on the way,
            and ideas shaping the future of your ride experience.
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-6'>
          {updates.map((u, i) => (
            <div
              key={i}
              className='shadow hover:shadow-lg transition h-[229px] w-full flex flex-col justify-between p-6'
              style={{
                backgroundImage: `url('${u.img}')`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className='w-full h-full' />
              <div className='h-full'>
                <HeadingHeebo className='font-semibold text-black text-left'>
                  {u.title}
                </HeadingHeebo>
                <p className='font-light text-[9px]'>
                  Perfect for daily use, events, or business trips.
                  <br /> Flexible hourly, daily, rates.
                </p>
                <p className='font-bold text-sm mt-2 hover:underline hover:cursor-pointer w-fit'>
                  Details
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
