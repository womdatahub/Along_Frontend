import Link from "next/link";
import {
  LogisticsHeroIcon,
  RentARideHeroIcon,
  ScheduleARideHeroIcon,
} from "@public/svgs";

export const Services = () => {
  const services = [
    {
      title: "Rent a ride",
      desc: "Perfect for daily use, events, or business trips. Flexible hourly, daily, rates.",
      img: <RentARideHeroIcon />,
    },
    {
      title: "Schedule ride",
      desc: "Book ahead for peace of mind. special occasions, or planned journeys.",
      img: <ScheduleARideHeroIcon />,
    },
    {
      title: "Logistics",
      desc: "Secure package handling with tracking updates.",
      img: <LogisticsHeroIcon />,
    },
  ];

  return (
    <section className='px-6 py-16 bg-white text-black'>
      <div className='flex flex-col gap-4 max-w-6xl mx-auto'>
        <div className='flex flex-col gap-4 md:w-1/3'>
          <h2 className='text-4xl font-extrabold'>Anytime, Anywhere</h2>
          <p className='font-light text-xl'>
            Experience stress-free travel with fast bookings, reliable drivers,
            and comfortable rides.
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-6'>
          {services.map((s, i) => (
            <div
              key={i}
              className='pt-8 pb-4 px-6 bg-[#E7EDED] rounded-xl shadow hover:shadow-lg transition'
            >
              <div className='flex flex-col justify-between'>
                <div className='flex gap-4 justify-between'>
                  <div className='flex flex-col w-[70%]'>
                    <h3 className='font-bold text-lg'>{s.title}</h3>
                    <p className='font-light text-[9px]'>{s.desc}</p>
                  </div>
                  {s.img}
                </div>
                <Link href='/' className='text-primary font-bold text-xs'>
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
