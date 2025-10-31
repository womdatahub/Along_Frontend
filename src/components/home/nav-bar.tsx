"use client";
import { useState, useEffect } from "react";
import { LogoIcon } from "@public/svgs";
import Link from "next/link";

export const Navbar = () => {
  // const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
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
      <div className="flex justify-between items-center h-20 px-4 md:px-0 max-w-6xl mx-auto ">
        {/* Logo */}
        <Link href="/">
          <LogoIcon />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-14 text-black text-xl">
          <Link href="/about">About</Link>
          <Link href="/onboarding">Ride</Link>
          <Link href="/onboarding">Drive</Link>
          <Link href="#">Help</Link>
        </div>

        {/* Mobile Toggle */}
        {/* <button
          className='md:hidden text-gray-800 text-2xl'
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button> */}
      </div>

      {/* Mobile Menu */}
      {/* {menuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200'>
          <ul className='flex flex-col items-center gap-4 py-4 text-gray-700'>
            <li>
              <Link href='#'>About</Link>
            </li>
            <li>
              <Link href='#'>Ride</Link>
            </li>
            <li>
              <Link href='#'>Drive</Link>
            </li>
            <li>
              <Link href='#'>Help</Link>
            </li>
          </ul>
        </div>
      )} */}
    </nav>
  );
};
