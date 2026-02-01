"use client";
import { useState, useEffect, useMemo } from "react";
import { LogoIcon } from "@public/svgs";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/store";
import { useShallow } from "zustand/shallow";
import { NameAvatar } from "../shared";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { userRole, riderProfile, driverProfile } = useSession(
    useShallow((state) => ({
      userRole: state.userRole,
      riderProfile: state.riderProfile,
      driverProfile: state.driverProfile,
      adminProfile: state.adminProfile,
    })),
  );

  const riderInitials = useMemo(
    () =>
      riderProfile?.firstName
        ? `${riderProfile?.firstName[0]}${riderProfile?.lastName[0]}`
        : "",
    [riderProfile],
  );
  const driverInitials = useMemo(
    () =>
      driverProfile?.firstName
        ? `${driverProfile?.firstName[0]}${driverProfile?.lastName[0]}`
        : "",
    [driverProfile],
  );
  const userInitials = "AL";

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
      <div className='flex justify-between items-center h-20 px-4 md:px-0 max-w-6xl mx-auto '>
        {/* Logo */}
        <Link href='/'>
          <LogoIcon />
        </Link>

        {/* Desktop Menu */}
        <div className='hidden md:flex gap-14 text-black text-xl'>
          <Link href='/about'>About</Link>
          <Link href='/rent-ride'>Ride</Link>
          <Link href='/onboarding'>Drive</Link>
          <Link href='#'>Help</Link>
          <Link
            href={
              userRole && userRole !== "user"
                ? `/${userRole.toLowerCase()}-db`
                : "/sign-in"
            }
            className='font-semibold flex items-center gap-2.5'
          >
            {userRole && userRole !== "user" ? (
              <NameAvatar
                value={riderInitials || driverInitials || userInitials}
                className='size-8 text-sm'
              />
            ) : (
              <Image
                alt='profile img'
                src='/images/account.png'
                width={30}
                height={30}
              />
            )}
            {!userRole && <p>Sign in</p>}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className='md:hidden text-gray-800 text-2xl'
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200'>
          <ul className='flex flex-col items-center gap-4 py-4 text-gray-700'>
            <li onClick={() => setMenuOpen(false)}>
              <Link href='/about'>About</Link>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <Link href='/rent-ride'>Ride</Link>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <Link href='/onboarding'>Drive</Link>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <Link href='#'>Help</Link>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <Link
                href={userRole ? `/${userRole.toLowerCase()}-db` : "/sign-in"}
                className='font-semibold flex items-center gap-2.5'
              >
                <Image
                  alt='profile img'
                  src='/images/account.png'
                  width={30}
                  height={30}
                />
                {!userRole && <p>Sign in</p>}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
