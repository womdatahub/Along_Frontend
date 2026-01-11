import type { Metadata } from "next";
import { Geist, Geist_Mono, Fustat, Heebo } from "next/font/google";
import {
  // CheckWindowSize,
  // CheckWindowSize,
  Toaster,
} from "@/components";
// import { AuthProvider } from "@/store";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-fustat",
});
const heebo = Heebo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-heebo",
});
export const metadata: Metadata = {
  title: "Along Cities",
  keywords: [
    "along",
    "cities",
    "along city",
    "along cities",
    "aolng",
    "alongcities",
    "alongcities.com",
  ],
  description:
    "Along Cities is your smart, reliable, and comfortable ride solution—connecting people and places with ease. Whether you're commuting to work, exploring new destinations, or just getting across town, we make every journey smoother, safer, and more enjoyable. Ride with confidence, ride with Along Cities. ✨ Join the Journey, Ride Along.",
  openGraph: {
    title: "Along Cities",
    description:
      "Along Cities is your smart, reliable, and comfortable ride solution—connecting people and places with ease. Whether you're commuting to work, exploring new destinations, or just getting across town, we make every journey smoother, safer, and more enjoyable. Ride with confidence, ride with Along Cities. ✨ Join the Journey, Ride Along.",
    url: "https://alongcities.com",
    siteName: "Along Cities",
    images: [
      {
        url: "https://alongcities.com/images/meta-3.jpg?v=2",
        width: 1200,
        height: 630,
        alt: "Along Cities Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Along Cities",
    description:
      "Along Cities is your smart, reliable, and comfortable ride solution—connecting people and places with ease. Whether you're commuting to work, exploring new destinations, or just getting across town, we make every journey smoother, safer, and more enjoyable. Ride with confidence, ride with Along Cities. ✨ Join the Journey, Ride Along.",
    images: ["https://alongcities.com/images/meta-3.jpg?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fustat.variable} ${heebo.variable} antialiased font-fustat selection:bg-primary/80 selection:text-primary-foreground`}
      >
        {children}
        {/* <CheckWindowSize> */}
        {/* {children} */}
        {/* </CheckWindowSize> */}
        <Toaster position='bottom-right' richColors />
      </body>
    </html>
  );
}
