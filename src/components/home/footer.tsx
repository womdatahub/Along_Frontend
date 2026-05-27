import { LogoComponent } from "@/components";
import {
  WhiteFacebookIcon,
  WhiteForwardIcon,
  WhiteInstagramIcon,
  WhiteLinkedInIcon,
  WhiteXIcon,
} from "@public/svgs";
import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  { href: "https://www.x.com", icon: WhiteXIcon, label: "X" },
  {
    href: "https://www.instagram.com",
    icon: WhiteInstagramIcon,
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com",
    icon: WhiteFacebookIcon,
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com",
    icon: WhiteLinkedInIcon,
    label: "LinkedIn",
  },
];

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/rent-ride", label: "Ride" },
  { href: "/onboarding", label: "Drive" },
  { href: "/help", label: "Help & Support" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col">
      <div className="bg-primary-deep text-white py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 justify-between">
          {/* Brand column */}
          <div className="flex flex-col gap-8 md:max-w-xs">
            <LogoComponent type2 />
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Along Cities connects people and places with smart, reliable, and
              comfortable ride solutions.
            </p>
            <div className="flex gap-3">
              {[
                { src: "/images/android.png", label: "Android" },
                { src: "/images/ios.png", label: "Apple" },
              ].map(({ src, label }) => (
                <button
                  key={label}
                  className="inline-flex items-center gap-2.5 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-sm font-semibold h-11 px-4 rounded-2xl transition-all duration-200"
                >
                  <Image
                    src={src}
                    alt={`${label} download`}
                    width={20}
                    height={24}
                    className="w-auto"
                  />
                  {label}
                  <WhiteForwardIcon />
                </button>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8">
            <nav className="flex flex-wrap gap-x-10 gap-y-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white/70 hover:text-white text-sm font-medium font-heebo transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="opacity-60 hover:opacity-100 transition-opacity duration-200"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-primary-deep/90 border-t border-white/10 text-white/50 px-5 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 font-heebo text-xs">
          <p>© 2025 - {currentYear} Along Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white/80 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-white/80 transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
