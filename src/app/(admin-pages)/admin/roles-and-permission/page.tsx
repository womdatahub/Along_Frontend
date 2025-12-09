"use client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/";
import { cn } from "@/lib";
import { AdminSearchIcon } from "@public/svgs";
import { useState } from "react";

// const isEmpty = false;
const Page = () => {
  const [userORRoles, setUserOrRoles] = useState<"user" | "roles">("user");
  return (
    <section className="flex flex-col gap-8">
      <p className="text-4xl font-heebo">Roles and Permission</p>

      <div className="flex self-end gap-7 items-center">
        <div className="flex gap-3 items-center px-3 py-2 rounded-full bg-white shadow-md min-w-[250px]">
          <AdminSearchIcon />
          <input
            type="text"
            name="search"
            id="search"
            className="bg-transparent focus:outline-none"
            placeholder="Search"
          />
        </div>
        <div className="flex bg-white p-2 rounded-full">
          <Button
            onClick={() => setUserOrRoles("user")}
            className={cn(
              "rounded-full transition-colors duration-300 shadow-none",
              userORRoles !== "user" &&
                "bg-transparent text-black hover:text-white"
            )}
          >
            Users
          </Button>
          <Button
            onClick={() => setUserOrRoles("roles")}
            className={cn(
              "rounded-full transition-colors duration-300 shadow-none",
              userORRoles !== "roles" &&
                "bg-transparent text-black hover:text-white"
            )}
          >
            Roles
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex border-b font-medium text-2xl pb-4">
            <p>Roles</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6 pb-6">
          {roles.map((r) => {
            return (
              <div
                key={r.role}
                className="flex bg-[#F4F4F4] justify-between items-center gap-5 rounded-2xl p-6"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">{r.role}</p>
                  <p className="text-sm font-light">{r.permission}</p>
                </div>
                <Button className="bg-[#B3BFBF] hover:bg-[#B3BFBF]/90 rounded-full">
                  Edit permission
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
};
export default Page;

const drivers = [
  {
    name: "John Doe",
    vehicleRegNumber: "ABC-123-KJA",
    driverID: "DRV-001",
    phoneNumber: "+2348012345678",
    address: "12 Adeola Street, Lagos",
    socialSecurityNo: "SSN-112233",
  },
  {
    name: "Jane Smith",
    vehicleRegNumber: "GGE-889-PH",
    driverID: "DRV-002",
    phoneNumber: "+2348098765432",
    address: "5 Odili Road, PH",
    socialSecurityNo: "SSN-445566",
  },
  {
    name: "Ahmed Musa",
    vehicleRegNumber: "KAN-552-KN",
    driverID: "DRV-003",
    phoneNumber: "+2348076543210",
    address: "Kano Central, Kano",
    socialSecurityNo: "SSN-778899",
  },
];

const roles = [
  {
    role: "Super Admin",
    permission: "Assign a super admin role to a user",
  },
  {
    role: "Safety Officer",
    permission: "Assign safety officer role to a user",
  },
  {
    role: "Ops Manager",
    permission: "Assign a super admin role to a user",
  },
  {
    role: "Finance",
    permission: "Assign finance role to a user",
  },
  {
    role: "Support Agent",
    permission: "Assign support agent role to a user",
  },
  {
    role: "Compliance",
    permission: "Assign compliance role to a user",
  },
];
