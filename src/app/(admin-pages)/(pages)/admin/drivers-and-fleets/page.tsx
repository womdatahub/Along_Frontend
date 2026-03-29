"use client";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTrigger,
  DriverInfoModal,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ConfirmActionModal,
} from "@/components/";
import { useAdmin } from "@/store";
// import { AdminFilterIcon, AdminSearchIcon } from "@public/svgs";
import { Car, Check, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";

const Page = () => {
  const {
    actions: { getAllDrivers, getPendingDriversKYC, getSuspendedDrivers },
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
              <TableHead className='text-[#768B8F]'>Driver Name</TableHead>
              <TableHead className='text-[#768B8F]'>
                Vehicle Reg Number
              </TableHead>
              <TableHead className='text-[#768B8F]'>Drivers ID</TableHead>
              <TableHead className='text-[#768B8F]'>Phone Number</TableHead>
              {/* <TableHead className='text-[#768B8F]'>Address</TableHead> */}
              <TableHead className='text-[#768B8F]'>
                Social Security No
              </TableHead>
              <TableHead className='text-[#768B8F]'>Action</TableHead>
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
                        <p>
                          {driver.driver.firstName} {driver.driver.lastName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className=' text-sm font-medium'>
                      {/* {driver.driver.} */}
                    </TableCell>
                    <TableCell className=' text-sm font-medium'>
                      {driver.driver.userId.slice(0, 4)}
                    </TableCell>
                    <TableCell className=' text-sm font-medium'>
                      {driver.mobileNumber}
                    </TableCell>
                    {/* <TableCell className=' text-sm font-medium'>
                    </TableCell> */}
                    <TableCell className=' text-sm font-medium'>
                      {/* {driver.} */}
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
                          confirmActionFunction={() => {}}
                          type='suspend'
                        />

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className='rounded-full bg-[#B3BFBF] hover:bg-[#B3BFBF]'>
                              View profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            dialogTitle='Select a vehicle type: Economy, Comfort, Comfort
                                XL, Luxury or Luxury XL'
                            className='max-w-sm md:max-w-md px-6 py-10'
                          >
                            <div className='flex items-start gap-3 mb-4'>
                              <Image
                                src={
                                  driver.driver.driverProfilePictureUri ??
                                  "/images/placeholder.jpg"
                                }
                                alt={driver.driver.firstName}
                                className='rounded-full size-[120px] object-cover'
                                width={120}
                                height={120}
                              />
                              <div className='flex w-full flex-col gap-5'>
                                <div className='flex flex-col'>
                                  <h2 className='text-2xl font-bold truncate'>
                                    {driver.driver.firstName}{" "}
                                    {driver.driver.lastName}
                                  </h2>
                                  <p className='text-sm font-semibold mt-0.5'>
                                    CabbageTown, Center Park
                                  </p>
                                </div>

                                <div className='flex gap-3 mt-1'>
                                  <div className='text-xl flex gap-3 items-center justify-center font-bold bg-primary text-white p-3 rounded-[5px]'>
                                    {driver.driver.rating.totalRating}
                                    <Star
                                      size={18}
                                      className='fill-white text-white'
                                    />
                                  </div>

                                  <div className='font-semibold'>
                                    <span className='text-xs '>Rating</span>
                                    <div>
                                      <div className='flex gap-3 items-center'>
                                        <span className='text-xs '>
                                          0 Reviews
                                        </span>
                                        <div className='flex gap-1 items-center'>
                                          {Array(
                                            driver.driver.rating.totalRating,
                                          )
                                            .fill(0)
                                            .map((_, i) => (
                                              <Star
                                                key={i}
                                                size={12}
                                                className='fill-icons text-icons'
                                              />
                                            ))}
                                          {Array(
                                            5 -
                                              driver.driver.rating.totalRating,
                                          )
                                            .fill(0)
                                            .map((_, i) => (
                                              <Star
                                                key={i}
                                                size={12}
                                                className='fill-gray-200 text-icons'
                                              />
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <span className='flex items-center gap-2 text-sm font-semibold'>
                                  <Phone
                                    size={15}
                                    className='fill-primary text-primary'
                                  />{" "}
                                  {driver.mobileNumber}
                                </span>
                                <div className='flex gap-2 items-center'>
                                  <span className='flex gap-2 text-xs text-gray-500'>
                                    <Car
                                      size={18}
                                      className='fill-primary text-white'
                                    />
                                    <div>
                                      <p className='font-bold text-sm'>0</p>
                                      <p className='text-xs'>Completed rides</p>
                                    </div>
                                  </span>
                                  <Separator
                                    orientation='vertical'
                                    className='h-4 w-2 bg-[#CDD4D4]'
                                  />

                                  <span className='flex gap-2 text-xs text-gray-500'>
                                    <MapPin
                                      size={18}
                                      className='fill-primary text-white'
                                    />
                                    <div>
                                      <p className='font-bold text-sm'>0ml</p>
                                      <p className='text-xs'>Distance shared</p>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Separator className='mb-4' />

                            <p className='text-base font-bold mb-'>
                              Registered Vehicle
                            </p>
                            <div className='flex gap-8'>
                              <div className='w-32 h-20 bg-red-500 rounded-lg' />
                              <div className='flex flex-col gap-2'>
                                <div>
                                  <p className='text-xs text-icon'>Car model</p>
                                  <p className='text-sm font-bold'>
                                    Tesla Model 3 · 2020
                                  </p>
                                </div>
                                <div>
                                  <p className='text-xs text-icon'>Licence</p>
                                  <p className='text-sm font-bold'>LA23 N7NC</p>
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                  <div className='flex gap-1 items-center'>
                                    <div className='size-3 bg-primary'>
                                      <Check
                                        size={10}
                                        className='text-white fill-white'
                                      />
                                    </div>{" "}
                                    <span className='text-xs font-semibold'>
                                      4 seats
                                    </span>
                                  </div>
                                  <div className='flex gap-1 items-center'>
                                    <div className='size-3 bg-primary'>
                                      <Check
                                        size={10}
                                        className='text-white fill-white'
                                      />
                                    </div>
                                    <span className='text-xs font-semibold'>
                                      Air condition
                                    </span>
                                  </div>
                                  <div className='flex gap-1 items-center'>
                                    <div className='size-3 bg-primary'>
                                      <Check
                                        size={10}
                                        className='text-white fill-white'
                                      />
                                    </div>{" "}
                                    <span className='text-xs font-semibold'>
                                      Passenger/rear bag
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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

                  <DriverInfoModal
                    trigger={<Button variant='ghost'>Open</Button>}
                    driverInfo={driver}
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
                  key={driver.email}
                  className='flex items-center gap-3 justify-between first:py-3 py-6 px-1'
                >
                  <div className='flex items-center gap-3'>
                    <Image
                      src={
                        // driver.driver.driverProfilePictureUri ??
                        "/images/placeholder.jpg"
                      }
                      alt={` profile picture`}
                      width={36}
                      height={36}
                      className='size-9 rounded-full object-cover'
                    />
                    <p className='text-sm font-medium'>
                      {/* {driver.driver.firstName} {driver.driver.lastName} */}
                    </p>
                  </div>

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
                    confirmActionFunction={() => {}}
                    type='reactivate'
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
