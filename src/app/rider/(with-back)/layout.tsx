"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto w-full flex-1 px-4 md:px-8 py-6 md:py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 mb-6 group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-primary transition-colors duration-200">
          <ChevronLeft size={16} className="text-gray-700 group-hover:text-primary transition-colors" />
        </div>
        Back
      </button>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
export default Layout;
