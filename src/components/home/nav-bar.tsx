"use client";

import { useState, useEffect } from "react";
import { LogoIcon } from "@public/svgs";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/store";
import { useShallow } from "zustand/shallow";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ChevronRight } from "lucide-react";
import { ROLE_DASHBOARD_MAP } from "@/lib/const";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { userRole } = useSession(
    useShallow((state) => ({ userRole: state.userRole })),
  );

  const dashboardHref = userRole
    ? ROLE_DASHBOARD_MAP[userRole] ?? "/sign-in"
    : "/sign-in";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-2/60"
            : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center h-18 px-5 md:px-8 max-w-7xl mx-auto">
          <Link href="/" className="shrink-0">
            <LogoIcon />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {userRole && userRole !== "driver" && (
              <Link
                href="/rent-ride"
                className="hover:text-primary transition-colors duration-200"
              >
                Rent a Ride
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {userRole && userRole !== "user" ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-deep transition-colors duration-200"
              >
                Dashboard
                <ChevronRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-4 hover:text-primary transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-deep transition-colors duration-200"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-background transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={20} className="text-gray-4" />
            ) : (
              <Menu size={20} className="text-gray-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-72 bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-5 border-b border-gray-2">
                  <LogoIcon />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-background transition-colors"
                  >
                    <X size={18} className="text-gray-4" />
                  </button>
                </div>

                <nav className="flex flex-col p-5 gap-1 flex-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 px-4 rounded-xl text-sm font-medium text-gray-4 hover:bg-background hover:text-primary transition-all duration-200"
                    >
                      {link.label}
                      <ChevronRight size={14} className="opacity-40" />
                    </Link>
                  ))}
                  {userRole && userRole !== "driver" && (
                    <Link
                      href="/rent-ride"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 px-4 rounded-xl text-sm font-medium text-gray-4 hover:bg-background hover:text-primary transition-all duration-200"
                    >
                      Rent a Ride
                      <ChevronRight size={14} className="opacity-40" />
                    </Link>
                  )}
                </nav>

                <div className="p-5 border-t border-gray-2 flex flex-col gap-3">
                  {userRole && userRole !== "user" ? (
                    <Link
                      href={dashboardHref}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-primary-deep transition-colors duration-200"
                    >
                      Go to Dashboard
                      <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/onboarding"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center bg-primary text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-primary-deep transition-colors duration-200"
                      >
                        Get started
                      </Link>
                      <Link
                        href="/sign-in"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center text-sm font-medium text-gray-4 py-3.5 rounded-2xl hover:bg-background transition-colors duration-200"
                      >
                        Sign in
                      </Link>
                    </>
                  )}
                </div>

                <div className="px-5 pb-8 flex items-center gap-2">
                  <Image
                    src="/images/account.png"
                    alt="Along Cities"
                    width={20}
                    height={20}
                    className="opacity-40"
                  />
                  <p className="text-xs text-gray font-medium">Along Cities</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
