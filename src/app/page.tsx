import dynamic from "next/dynamic";
import { Navbar, Hero } from "@/components";

// Below-fold sections: lazy-loaded so they don't block the initial paint.
// Hero + Navbar are eagerly loaded — they are above the fold.
const Features = dynamic(() =>
  import("@/components/home/features").then((m) => ({ default: m.Features })),
);
const Services = dynamic(() =>
  import("@/components/home/services").then((m) => ({ default: m.Services })),
);
const HowItWorks = dynamic(() =>
  import("@/components/home/how-it-works").then((m) => ({
    default: m.HowItWorks,
  })),
);
const Updates = dynamic(() =>
  import("@/components/home/updates").then((m) => ({ default: m.Updates })),
);
const AppDownload = dynamic(() =>
  import("@/components/home/app-download").then((m) => ({
    default: m.AppDownload,
  })),
);
const FAQ = dynamic(() =>
  import("@/components/home/faq").then((m) => ({ default: m.FAQ })),
);
const Footer = dynamic(() =>
  import("@/components/home/footer").then((m) => ({ default: m.Footer })),
);

export default function Home() {
  return (
    <div className="font-fustat overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <HowItWorks />
      <Updates />
      <AppDownload />
      <FAQ />
      <Footer />
    </div>
  );
}
