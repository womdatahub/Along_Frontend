"use client";

import { useEffect, useState } from "react";
import { LogoIcon } from "@public/svgs";
import Link from "next/link";

export const AuthNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-2/60"
          : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between h-18 px-5 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex-shrink-0">
          <LogoIcon />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-gray hover:text-primary transition-colors duration-200"
        >
          ← Back to home
        </Link>
      </div>
    </nav>
  );
};
