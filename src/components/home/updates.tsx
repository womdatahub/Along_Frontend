import { ArrowRight } from "lucide-react";

const updates = [
  {
    title: "Update Alert",
    subtitle: "Coming Soon",
    img: "/images/horizon-1.png",
    textColor: "text-white",
  },
  {
    title: "Update Alert",
    subtitle: "Coming Soon",
    img: "/images/horizon-2.png",
    textColor: "text-white",
  },
  {
    title: "Update Alert",
    subtitle: "Coming Soon",
    img: "/images/horizon-3.png",
    textColor: "text-black",
  },
];

export const Updates = () => {
  return (
    <section className="px-5 md:px-8 pb-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 font-heebo">
              What&apos;s Next
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-black font-heebo leading-tight">
              On the Horizon
            </h2>
          </div>
          <p className="text-gray text-sm font-light max-w-sm leading-relaxed">
            Stay in the know with what&apos;s next — from new features to fresh
            insights shaping your ride experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {updates.map((u, i) => (
            <div
              key={i}
              className="relative group rounded-2xl overflow-hidden h-64 flex flex-col justify-end p-6 shadow hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: `url('${u.img}')`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
              <div className={`relative z-10 ${u.textColor}`}>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1 font-heebo">
                  {u.subtitle}
                </p>
                <h3 className="font-bold text-lg font-heebo mb-2">{u.title}</h3>
                <p className="text-xs opacity-70 font-light leading-relaxed mb-3">
                  Perfect for daily use, events, or business trips. Flexible
                  hourly and daily rates.
                </p>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity">
                  Details
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
