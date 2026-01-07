"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export const CheckWindowSize = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (isMobile && pathname !== "/") {
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
