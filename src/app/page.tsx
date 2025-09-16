import {
  Navbar,
  Hero,
  Features,
  Services,
  HowItWorks,
  AppDownload,
  FAQ,
  Updates,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <div className='font-fustat'>
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
