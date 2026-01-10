"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { AdminRefreshIcon, AdminSearchIcon } from "@public/svgs";

const isEmpty = false;
const Page = () => {
  return (
    <section className="flex flex-col gap-8">
      <p className="text-4xl font-heebo">SOS Console</p>
      <Card className="pb-10">
        <CardHeader>
          <div className="flex justify-between border-b pb-6">
            <p className="font-medium text-2xl">Open Alerts (3)</p>
            <Button className="bg-[#E0E6E6] hover:bg-[#E0E6E6]/90 rounded-full text-black">
              <AdminRefreshIcon />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 grid-cols-2">
          {trips.map((trip) => {
            return (
              <div
                key={trip.tripID}
                className="flex bg-[#F4F4F4] justify-between items-center gap-5 rounded-2xl p-6"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">Trip ID: {trip.tripID}</p>
                  <p className="text-sm">Driver: {trip.driver}</p>
                  <p className="bg-[#FD6E58] px-1">Rider: {trip.rider}</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="border-[#B3BFBF] rounded-full"
                  >
                    Call driver
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#B3BFBF] rounded-full"
                  >
                    Call ridPer
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="rounded-full">More</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-medium cursor-pointer">
                          Open trip
                        </p>
                        <p className="text-xs font-medium cursor-pointer">
                          Call 911
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="rounded-3xl border border-gray-300 flex flex-col gap-4 py-4">
        <div className="flex justify-between gap-5 items-center px-6">
          <p className="text-xl font-medium">Alert logs</p>
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
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]">
              <TableHead className="text-[#768B8F] pl-6">Type</TableHead>
              <TableHead className="text-[#768B8F]">Timestamp</TableHead>
              <TableHead className="text-[#768B8F]">Trip ID</TableHead>
              <TableHead className="text-[#768B8F]">Initiator</TableHead>
            </TableRow>
          </TableHeader>

          {isEmpty ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="p-10">
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
              {alertTables.map((alert, i) => {
                return (
                  <TableRow key={i} className="last:border-b-0">
                    <TableCell className=" text-sm font-medium pl-6">
                      {alert.type}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {alert.timeStamp}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {alert.tripID}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {alert.initiator}
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

const trips = [
  {
    tripID: "R-224320",
    driver: "Duncan Jay",
    rider: "Martha Gradiela",
  },
  {
    tripID: "R-882191",
    driver: "James Ade",
    rider: "Sarah Bello",
  },
  {
    tripID: "R-553002",
    driver: "Kelvin Stone",
    rider: "Anita Gomez",
  },
];

const alertTables = [
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 09:16:36",
    tripID: "R-224654",
    initiator: "Tina Penedalene",
  },
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 10:04:12",
    tripID: "R-331902",
    initiator: "Mark Odewale",
  },
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 11:55:41",
    tripID: "R-119432",
    initiator: "Helen Rivera",
  },
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 12:33:09",
    tripID: "R-887201",
    initiator: "Daniel Obinna",
  },
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 13:47:22",
    tripID: "R-550781",
    initiator: "Grace Makinde",
  },
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 14:25:50",
    tripID: "R-774990",
    initiator: "Rita Castellanos",
  },
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 15:18:03",
    tripID: "R-992614",
    initiator: "Samuel Farouk",
  },
  {
    type: "SOS alert",
    timeStamp: "2025-11-22 16:42:28",
    tripID: "R-665330",
    initiator: "Chloe Mensah",
  },
];
