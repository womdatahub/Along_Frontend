"use client";
import {
  Button,
  Card,
  CardContent,
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
import Image from "next/image";
import Link from "next/link";

const isEmpty = false;
const Page = () => {
  return (
    <section className="flex flex-col gap-8">
      <p className="text-4xl font-heebo">Drivers & Fleets</p>

      <div className="rounded-md border border-gray-300 flex flex-col gap-2 py-4">
        <p className="ml-2">0 Users</p>
        <Table className="border-b border-b-gray-300">
          <TableHeader>
            <TableRow className="bg-[#F4F1F3]">
              <TableHead className="w-4">
                <div className="border-[1.5px] border-[#5C4D58] rounded-[4px] size-4" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>User type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last login</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          {isEmpty ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="p-10">
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
              {[].map((u, i) => {
                return (
                  <TableRow key={i} className="text-sm">
                    <TableCell>
                      {/* <div className="border-[1.5px] border-[#5C4D58] rounded-[4px] size-4" /> */}
                    </TableCell>
                    <TableCell>
                      {/* <div className="flex gap-2 items-center">
                        <Image
                          src={u.image}
                          alt={u.name}
                          width={40}
                          height={40}
                          className="rounded-full size-8"
                        />
                        <p>{u.name}</p>
                      </div> */}
                    </TableCell>
                    <TableCell>{/* {u.phone} */}</TableCell>
                    <TableCell>{/* {u.userType} */}</TableCell>
                    <TableCell>{/* {u.location} */}</TableCell>
                    <TableCell
                      className={cn(
                        "text-[#008000]"
                        // u.status === "Inactive" && "text-[#8B7606]",
                        // u.status === "Suspended" && "text-[#D63A0F]"
                      )}
                    >
                      {/* {u.status} */}
                    </TableCell>
                    <TableCell>{/* {u.lastLogin} */}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/user-management/${i}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>

      <div className="flex gap-8">
        <div className="flex gap-2 flex-col flex-1">
          <p className="font-semibold text-xl">Pending Activation</p>
          <Card className="p-5 gap-1 flex-1">
            <CardContent className="p-0">
              {[0, 1, 2].map((it) => (
                <div
                  key={it}
                  className="flex items-center gap-3 justify-between  first:py-3 border-b last:border-b-0 py-6 px-4"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/placeholder.jpg"
                      alt="image"
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium">Mark Spencer</p>
                  </div>
                  <Button variant="ghost">Open</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-2 flex-col flex-1">
          <p className="font-semibold text-xl">Suspended user</p>
          <Card className="p-5 gap-1 flex-1">
            <CardContent className="p-0">
              {[0, 1, 2].map((it) => (
                <div
                  key={it}
                  className="flex items-center gap-3 justify-between first:py-3 py-6 px-1"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/placeholder.jpg"
                      alt="image"
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium">Mark Spencer</p>
                  </div>
                  <Button
                    variant="default"
                    className="bg-[#B3BFBF] hover:bg-[#B3BFBF]/90 rounded-full"
                  >
                    Reactivate
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default Page;
