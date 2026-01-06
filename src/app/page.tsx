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
  //   actions: { login, fetchUserDetails },
  // } = useSession((state) => state);

  // useEffect(() => {
  //   fetchUserDetails()
  //     // login({
  //     //   email: "javascriptwonder@gmail.com",
  //     //   password: "se3di$God",
  //     // })
  //     .finally(() => {
  //       console.log("user details fetched in");
  //     });

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // console.log("RENDERING HOME PAGE");
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
