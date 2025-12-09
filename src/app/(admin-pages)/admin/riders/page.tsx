"use client";
import {
  Button,
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
import { AdminFilterIcon, AdminSearchIcon } from "@public/svgs";
import Image from "next/image";

const isEmpty = false;
const Page = () => {
  return (
    <section className="flex flex-col gap-8">
      <p className="text-4xl font-heebo">Riders</p>

      <div className="rounded-3xl border border-gray-300 flex flex-col gap-4 py-4">
        <div className="flex justify-between gap-5 items-center px-6">
          <p className="text-xl font-medium">Riders information</p>
          <div className="flex items-center gap-5">
            <div className="flex gap-3 items-center px-3 py-2 rounded-full bg-[#EAEAEA] min-w-[325px]">
              <AdminSearchIcon />
              <input
                type="text"
                name="search"
                id="search"
                className="bg-transparent focus:outline-none"
                placeholder="Search"
              />
            </div>
            <AdminFilterIcon />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]">
              <TableHead className="text-[#768B8F]">Driver Name</TableHead>
              <TableHead className="text-[#768B8F]">
                Vehicle Reg Number
              </TableHead>
              <TableHead className="text-[#768B8F]">Drivers ID</TableHead>
              <TableHead className="text-[#768B8F]">Phone Number</TableHead>
              <TableHead className="text-[#768B8F]">Address</TableHead>
              <TableHead className="text-[#768B8F]">
                Social Security No
              </TableHead>
              <TableHead className="text-[#768B8F]">Action</TableHead>
            </TableRow>
          </TableHeader>

          {isEmpty ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="p-10">
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No information found</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {[...drivers, ...drivers].map((driver, i) => {
                return (
                  <TableRow key={i} className="last:border-b-0">
                    <TableCell className="text-sm font-medium py-5">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/about-vision.png"
                          alt="Profile image"
                          className="rounded-full size-8 object-cover"
                          width={32}
                          height={32}
                        />
                        <p>{driver.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {driver.vehicleRegNumber}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {driver.driverID}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {driver.phoneNumber}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {driver.address}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {driver.socialSecurityNo}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Button className="rounded-full bg-[#B3BFBF] hover:bg-[#B3BFBF]">
                          Suspend
                        </Button>
                        <Button className="rounded-full bg-[#B3BFBF] hover:bg-[#B3BFBF]">
                          View profile
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>
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
