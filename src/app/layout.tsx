import type { Metadata } from "next";
import { Geist, Geist_Mono, Fustat, Heebo } from "next/font/google";
import {
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
  description: "Along Cities, your best ride solution.",
  openGraph: {
    title: "Along Cities",
    description: "Along Cities, your best ride solution.",
    url: "https://alongcities.com",
    siteName: "Along Cities",
    images: [
      {
        url: "https://alongcities.com/meta-1.jpg",
        width: 1200,
        height: 630,
        alt: "Along Cities Preview",
      },
      {
        url: "https://alongcities.com/meta-2.jpg",
        width: 1200,
        height: 630,
        alt: "Along Cities Preview",
      },
      {
        url: "https://alongcities.com/meta-3.jpg",
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
    description: "Along Cities, your best ride solution.",
    images: [
      "https://alongcities.com/meta-1.jpg",
      "https://alongcities.com/meta-2.jpg",
      "https://alongcities.com/meta-3.jpg",
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} ${fustat.variable} ${heebo.variable} antialiased font-fustat`}
      >
        {/* <AuthProvider>{children}</AuthProvider> */}
        {/* <CheckWindowSize>{children}</CheckWindowSize> */}
        {children}
        <Toaster position='bottom-right' richColors />
      </body>
    </html>
  );
}
