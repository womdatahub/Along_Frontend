import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const services = [
  {
    title: "Rent a Ride",
    desc: "Perfect for daily commutes, events, or business trips. Flexible hourly and daily rates with professional drivers.",
    img: "/images/rent-ride-small-car.png",
    path: "/rent-ride",
    badge: "Available now",
    available: true,
  },
  {
    title: "Schedule Ride",
    desc: "Book ahead for peace of mind. Ideal for airport transfers, special occasions, or planned journeys.",
    img: "/images/schedule-ride-small-car.png",
    path: "/schedule-ride",
    badge: "Coming soon",
    available: false,
  },
  {
    title: "Logistics",
    desc: "Reliable package handling with real-time tracking updates. From sender to recipient, we ensure safe delivery.",
    img: null,
    path: "/",
    badge: "Coming soon",
    available: false,
  },
];

export const Services = () => {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 font-heebo">
              Our Services
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-black font-heebo leading-tight">
              Anytime,
              <br className="hidden md:block" /> Anywhere
            </h2>
          </div>
          <p className="text-gray text-base md:text-lg font-light max-w-sm leading-relaxed">
            Experience stress-free travel with fast bookings, reliable drivers,
            and comfortable rides.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={i}
              className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
                s.available
                  ? "bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            >
              <div className="p-6 flex flex-col gap-4 min-h-52">
                {/* Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold font-heebo ${
                    s.available
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-2 text-gray"
                  }`}
                >
                  {!s.available && <Clock size={10} />}
                  {s.badge}
                </span>

                <div className="flex items-start justify-between gap-4 flex-1">
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-lg text-black font-heebo">
                      {s.title}
                    </h3>
                    <p className="text-gray text-sm font-light leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  {s.img && (
                    <Image
                      src={s.img}
                      alt={s.title}
                      width={96}
                      height={68}
                      className="object-contain shrink-0"
                    />
                  )}
                  {!s.img && (
                    <div className="w-24 h-16 rounded-xl bg-background shrink-0 flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                </div>

                <Link
                  href={s.path}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 self-start ${
                    s.available
                      ? "text-primary group-hover:gap-2.5"
                      : "text-gray pointer-events-none"
                  }`}
                >
                  {s.available ? "Book now" : "Notify me"}
                  {s.available && <ArrowRight size={14} />}
                </Link>
              </div>

              {/* Bottom accent line */}
              {s.available && (
                <div className="h-0.5 bg-linear-to-r from-primary to-lightgreen w-0 group-hover:w-full transition-all duration-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
