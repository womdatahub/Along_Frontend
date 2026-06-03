"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export const AppDownload = () => {
  return (
    <section className="px-5 md:px-8 py-16 md:py-20 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Text column */}
        <div className="flex flex-col gap-5 md:w-1/2">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest font-heebo">
            Mobile App
          </p>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold font-heebo leading-tight">
            Get more
            <br />from the app
          </h2>
          <p className="text-white/70 text-base font-light leading-relaxed max-w-sm">
            Experience stress-free travel with fast bookings, reliable drivers,
            and comfortable rides — right from your pocket.
          </p>

          <div className="flex gap-3 flex-wrap mt-2">
            {[
              { src: "/images/android.png", label: "Android" },
              { src: "/images/ios.png", label: "Apple" },
            ].map(({ src, label }) => (
              <button
                key={label}
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold font-heebo py-3.5 px-5 rounded-2xl transition-all duration-200 text-sm md:text-base"
              >
                <Image
                  src={src}
                  alt={`${label} download`}
                  width={24}
                  height={28}
                  className="w-auto"
                />
                {label}
                <ArrowUpRight size={14} className="opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Phone image */}
        <div className="hidden md:flex md:w-1/2 justify-end items-end">
          <Image
            src="/images/iphone-15.png"
            alt="Along Cities mobile app"
            width={420}
            height={470}
            className="drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};
