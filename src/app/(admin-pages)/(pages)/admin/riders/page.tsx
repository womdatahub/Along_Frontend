"use client";
import {
  Button,
  Card,
  CardContent,
  ConfirmActionModal,
  DriverPendingInfoModal,
  Empty,
  EmptyHeader,
  EmptyTitle,
  NameAvatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/";
import { useAdmin } from "@/store";
// import { AdminFilterIcon, AdminSearchIcon } from "@public/svgs";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import Image from "next/image";

const Page = () => {
  const {
    actions: {
      getAllRiders,
      getSuspendedRiders,
      getpendingKyc,
      getSingleDriverDetails,
      suspendDriverOrRider,
      reactivateDriverOrRider,
    },
    allRiders,
    suspendedRiders,
    pendingKyc,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      allRiders: state.allRiders,
      suspendedRiders: state.suspendedRiders,
      pendingKyc: state.pendingKyc,
    })),
  );

  useEffect(() => {
    getAllRiders();
    getSuspendedRiders();
    getpendingKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="flex flex-col gap-8">
      <p className="text-2xl md:text-4xl font-heebo">Riders</p>

      <div className="rounded-xl md:rounded-3xl border border-gray-300 flex flex-col gap-4 py-4 bg-white">
        <div className="flex flex-col md:flex-row justify-between gap-5 md:items-center px-2 md:px-6">
          <p className="text-xl text-left font-medium">Riders information</p>
          {/* <div className='flex items-center gap-5'>
            <div className='flex gap-3 items-center px-3 py-2 rounded-full bg-[#EAEAEA] md:min-w-[325px]'>
              <AdminSearchIcon />
              <input
                type='text'
                name='search'
                id='search'
                className='bg-transparent focus:outline-none'
                placeholder='Search'
              />
            </div>
            <AdminFilterIcon />
          </div> */}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]">
              <TableHead className="text-icons">Riders Name</TableHead>
              <TableHead className="text-icons">Email</TableHead>
              <TableHead className="text-icons">Phone Number</TableHead>
              <TableHead className="text-icons">Riders ID</TableHead>
              <TableHead className="text-icons">Gender</TableHead>
              <TableHead className="text-icons">Action</TableHead>
            </TableRow>
          </TableHeader>

          {allRiders.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="p-10">
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
              {allRiders.map((rider, i) => {
                return (
                  <TableRow key={i} className="last:border-b-0">
                    <TableCell className="text-sm font-medium py-5">
                      <div className="flex items-center gap-2">
                        <NameAvatar
                          value={`${rider.rider.firstName[0] ?? ""}${rider.rider.lastName[0] ?? ""}`}
                          className="size-8 md:size-8 text-base md:text-base"
                        />
                        <p>
                          {rider.rider.firstName} {rider.rider.lastName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {rider.email}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {rider.mobileNumber}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {rider.rider.userId}
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {rider.gender ?? "Male"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ConfirmActionModal
                          trigger={
                            <Button className="rounded-full bg-primary hover:bg-primary">
                              Suspend
                            </Button>
                          }
                          title="Suspend rider"
                          description="Are you sure you want to suspend this rider"
                          confirmActionFunction={async (values) => {
                            if (!values) return;
                            await suspendDriverOrRider(
                              {
                                userId: rider.rider.userId,
                                reason: values.reason!,
                                suspensionType:
                                  values.suspensionType!.toUpperCase(),
                                suspensionDuration: Number(
                                  values.suspensionDuration,
                                ),
                              },
                              "rider",
                            );
                          }}
                          type="suspend"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="flex gap-2 flex-col flex-1">
          <p className="font-semibold text-xl">Suspended riders</p>
          <Card className="p-5 gap-1 flex-1">
            <CardContent className="p-0">
              {suspendedRiders.length === 0 && (
                <Empty className="py-20">
                  <EmptyHeader>
                    <EmptyTitle>No information found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
              {suspendedRiders.map((rider) => (
                <div
                  key={rider.rider.userId}
                  className="flex items-center gap-3 justify-between first:py-3 py-6 px-1"
                >
                  <div className="flex items-center gap-3">
                    <NameAvatar
                      value={`${rider.rider.firstName[0] ?? ""}${rider.rider.lastName[0] ?? ""}`}
                      className="size-8 md:size-8 text-base md:text-base"
                    />
                    <p className="text-sm font-medium">
                      {rider.rider.firstName} {rider.rider.lastName}
                    </p>
                  </div>

                  <ConfirmActionModal
                    trigger={
                      <Button
                        variant="default"
                        className="bg-primary hover:bg-primary/90 rounded-full"
                      >
                        Reactivate
                      </Button>
                    }
                    title="Reactivate rider"
                    description="Are you sure you want to reactivate this rider"
                    confirmActionFunction={async () => {
                      await reactivateDriverOrRider(
                        {
                          userId: rider.rider.userId,
                        },
                        "rider",
                      );
                    }}
                    type="reactivate"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="flex gap-2 flex-col flex-1">
          <p className="font-semibold text-xl">KYC Requests</p>
          <Card className="p-5 gap-1 flex-1">
            <CardContent className="p-0">
              {(!pendingKyc || pendingKyc.riders.length === 0) && (
                <Empty className="py-20">
                  <EmptyHeader>
                    <EmptyTitle>No information found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
              {pendingKyc &&
                pendingKyc.riders.length > 0 &&
                pendingKyc.riders.map((rider, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 justify-between  first:py-3 border-b last:border-b-0 py-6 px-4"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          rider.profilePictureUri ?? "/images/placeholder.jpg"
                        }
                        alt={`${rider.firstName} ${rider.lastName} profile picture`}
                        width={36}
                        height={36}
                        className="size-9 rounded-full object-cover"
                      />
                      <p className="text-sm font-medium">
                        {rider.firstName} {rider.lastName}
                      </p>
                    </div>
                    {/* TODO: Change this for rider or make it dynamic */}
                    <DriverPendingInfoModal
                      trigger={
                        <Button
                          onClick={() => getSingleDriverDetails(rider._id)}
                          variant="ghost"
                        >
                          Open
                        </Button>
                      }
                    />
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
