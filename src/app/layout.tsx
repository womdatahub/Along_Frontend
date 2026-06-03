import type { Metadata } from "next";
import { Fustat, Heebo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { AuthProvider } from "@/store/auth-provider";
import { QueryProvider } from "@/lib/providers/query-provider";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-fustat",
});

const heebo = Heebo({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem('along-dark-mode');if(d==='true')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${fustat.variable} ${heebo.variable} antialiased font-fustat selection:bg-primary/20 selection:text-primary`}
      >
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
