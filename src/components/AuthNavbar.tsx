"use client";
import { useState, useEffect } from "react";
import { LogoIcon } from "@public/svgs";
import Link from "next/link";

export const AuthNavbar = () => {
  // const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-700 ${
        scrolled ? "bg-white/50" : "bg-white"
      }`}
    >
      <div className='flex justify-between items-center h-20 px-4 md:px-0 max-w-7xl mx-auto '>
        <Link href='/'>
          <LogoIcon />
        </Link>
      </div>
    </nav>
  );
};
