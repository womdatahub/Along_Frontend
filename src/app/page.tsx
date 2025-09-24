"use client";
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
// import { useSession } from "@/store";
// import { useEffect } from "react";

export default function Home() {
  // const {
  //   actions: { login },
  // } = useSession((state) => state);

  // const logger = async () => {
  //   await login({ email: "2k0dL@example.com", password: "123456" });
  // };
  // useEffect(() => {
  //   logger();
  // }, []);
  return (
    <div className='font-fustat overflow-x-hidden'>
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
