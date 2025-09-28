"use client";
import { useEffect, useState } from "react";

export const CheckWindowSize = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 650);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div className='flex items-center justify-center h-screen w-screen'>
        <p className='text-lg font-semibold text-center px-4 animate-pulse'>
          To use this service on mobile, please download our app.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
