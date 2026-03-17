"use client";
import { Navbar } from "@/components";
import { ROLE_DASHBOARD_MAP } from "@/lib";
import { useSession } from "@/store";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
// import { AuthProvider } from "@/store";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { userRole } = useSession(
    useShallow((state) => ({
      userRole: state.userRole,
    })),
  );
  const router = useRouter();

  if (!userRole) {
    router.push("/");
    return;
  }
  if (userRole === "rider" || userRole === "admin") {
    router.push(ROLE_DASHBOARD_MAP[userRole]);
    return;
  }

  return (
    <section className='w-screen min-h-screen flex flex-col bg-background-1'>
      <Navbar />
      <div className='flex-1 h-full flex flex-col gap-2 py-28 lg:pt-20'>
        {children}
      </div>
    </section>
  );
};
export default Layout;
