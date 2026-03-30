"use client";
import {
  Button,
  Card,
  CardContent,
  DriverPendingInfoModal,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ConfirmActionModal,
  DriverInformationModal,
} from "@/components/";
import { useAdmin } from "@/store";
// import { AdminFilterIcon, AdminSearchIcon } from "@public/svgs";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";

const Page = () => {
  const {
    actions: {
      getAllDrivers,
      getPendingDriversKYC,
      getSuspendedDrivers,
      getSingleDriverDetails,
      suspendDriverOrRider,
      reactivateDriverOrRider,
    },
    pendingDriversKYC,
    allDrivers,
    suspendedDrivers,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      pendingDriversKYC: state.pendingDriversKYC,
      allDrivers: state.allDrivers,
      suspendedDrivers: state.suspendedDrivers,
    })),
  );

  useEffect(() => {
    getAllDrivers();
    getPendingDriversKYC();
    getSuspendedDrivers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className='flex flex-col gap-8'>
      <p className='text-2xl md:text-4xl font-heebo'>Drivers & Fleets</p>

      <div className='rounded-xl md:rounded-3xl border bg-white border-gray-300 flex flex-col gap-4 py-4'>
        <div className='flex flex-col md:flex-row justify-between gap-5 md:items-center px-2 md:px-6'>
          <p className='text-xl text-left font-medium'>Drivers information</p>
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
            <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
              <TableHead className='text-icons'>Driver Name</TableHead>
              <TableHead className='text-icons'>Email</TableHead>
              <TableHead className='text-icons'>Phone Number</TableHead>
              <TableHead className='text-icons'>Rating</TableHead>
              <TableHead className='text-icons'>Social Security No</TableHead>
              <TableHead className='text-icons'>Action</TableHead>
            </TableRow>
          </TableHeader>

          {allDrivers.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className='p-10'>
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
              {allDrivers.map((driver, i) => {
                return (
                  <TableRow key={i} className='last:border-b-0'>
                    <TableCell className='text-sm font-medium py-5'>
                      <div className='flex items-center gap-2'>
                        <Image
                          src={
                            driver.driver.driverProfilePictureUri ??
                            "/images/placeholder.jpg"
                          }
                          alt={driver.driver.firstName}
                          className='rounded-full size-8 object-cover'
                          width={32}
                          height={32}
                        />
                        <p className='truncate'>
                          {driver.driver.firstName} {driver.driver.lastName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className=' text-sm font-medium truncate'>
                      {driver.email}
                    </TableCell>
                    <TableCell className=' text-sm font-medium truncate'>
                      {driver.mobileNumber}
                    </TableCell>
                    <TableCell className=' text-sm font-medium'>
                      {driver.driver.rating.totalRating}
                    </TableCell>

                    <TableCell className=' text-sm font-medium truncate'>
                      {driver.driver.driverSocialSecurityNumber}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <ConfirmActionModal
                          trigger={
                            <Button className='rounded-full bg-[#B3BFBF] hover:bg-[#B3BFBF]'>
                              Suspend
                            </Button>
                          }
                          title='Suspend driver'
                          description='Are you sure you want to suspend this driver'
                          confirmActionFunction={async (values) => {
                            if (!values) return;
                            await suspendDriverOrRider(
                              {
                                userId: driver.driver.userId,
                                reason: values.reason,
                                suspensionType:
                                  values.suspensionType.toUpperCase(),
                                suspensionDuration: Number(
                                  values.suspensionDuration,
                                ),
                              },
                              "driver",
                            );
                          }}
                          type='suspend'
                        />
                        <DriverInformationModal
                          trigger={
                            <Button
                              onClick={() =>
                                getSingleDriverDetails(driver.driver.userId)
                              }
                              className='rounded-full bg-[#B3BFBF] hover:bg-[#B3BFBF]'
                            >
                              View profile
                            </Button>
                          }
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

      <div className='flex flex-col md:flex-row gap-4 md:gap-8'>
        <div className='flex gap-2 flex-col flex-1'>
          <p className='font-semibold text-xl'>Pending Activation</p>
          <Card className='p-5 gap-1 flex-1'>
            <CardContent className='p-0'>
              {pendingDriversKYC.length === 0 && (
                <Empty className='py-20'>
                  <EmptyHeader>
                    <EmptyTitle>No information found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
              {pendingDriversKYC.map((driver, i) => (
                <div
                  key={i}
                  className='flex items-center gap-3 justify-between  first:py-3 border-b last:border-b-0 py-6 px-4'
                >
                  <div className='flex items-center gap-3'>
                    <Image
                      src={
                        driver.driverProfilePictureUri ??
                        "/images/placeholder.jpg"
                      }
                      alt={`${driver.firstName} ${driver.lastName} profile picture`}
                      width={36}
                      height={36}
                      className='size-9 rounded-full object-cover'
                    />
                    <p className='text-sm font-medium'>
                      {driver.firstName} {driver.lastName}
                    </p>
                  </div>

                  <DriverPendingInfoModal
                    trigger={
                      <Button
                        onClick={() => getSingleDriverDetails(driver.id)}
                        variant='ghost'
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
        <div className='flex gap-2 flex-col flex-1'>
          <p className='font-semibold text-xl'>Suspended drivers</p>
          <Card className='p-5 gap-1 flex-1'>
            <CardContent className='p-0'>
              {suspendedDrivers.length === 0 && (
                <Empty className='py-20'>
                  <EmptyHeader>
                    <EmptyTitle>No information found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
              {suspendedDrivers.map((driver) => (
                <div
                  key={driver.driver.firstName}
                  className='flex items-center gap-3 justify-between first:py-3 py-6 px-1'
                >
                  <div className='flex items-center gap-3'>
                    <Image
                      src={
                        driver.driver.driverProfilePictureUri ??
                        "/images/placeholder.jpg"
                      }
                      alt={`Driver profile picture`}
                      width={36}
                      height={36}
                      className='size-9 rounded-full object-cover'
                    />
                    <p className='text-sm font-medium'>
                      {driver.driver.firstName} {driver.driver.lastName}
                    </p>
                  </div>
                  <div className='flex flex-col md:flex-row gap-2 md:items-center'>
                    <ConfirmActionModal
                      trigger={
                        <Button
                          variant='default'
                          className='bg-[#B3BFBF] hover:bg-[#B3BFBF]/90 rounded-full'
                        >
                          Reactivate
                        </Button>
                      }
                      title='Reactivate driver'
                      description='Are you sure you want to reactivate this driver'
                      confirmActionFunction={async () => {
                        await reactivateDriverOrRider(
                          {
                            userId: driver._id,
                          },
                          "driver",
                        );
                      }}
                      type='reactivate'
                    />
                    <DriverInformationModal
                      trigger={
                        <Button
                          onClick={() => getSingleDriverDetails(driver._id)}
                          className='rounded-full bg-[#B3BFBF] hover:bg-[#B3BFBF]'
                        >
                          View profile
                        </Button>
                      }
                    />
                  </div>
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
