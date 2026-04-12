"use client";

import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Empty,
  EmptyTitle,
  EmptyHeader,
} from "@/components/";
import { cn } from "@/lib";
import { useAdmin } from "@/store";
// import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const {
    actions: {
      // getActiveRentals,
      // getActiveRides,
      // getPendingRequests,
      // getDriverAvailability,
      // getRideRoutePlayback,
      // getAdminDashboardDetails,
      // getSOSAlerts,
    },
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
    })),
  );

  // useEffect(() => {
  // getActiveRentals();
  // getActiveRides();
  // getPendingRequests();
  // getDriverAvailability();
  // getRideRoutePlayback();
  // getAdminDashboardDetails();
  // getSOSAlerts();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <section className='flex flex-col gap-8'>
      <p className='text-2xl md:text-4xl font-heebo'>Dashboard</p>
      <div className='flex flex-col md:flex-row gap-4 md:gap-8'>
        <div className='flex gap-4 md:gap-8 flex-col md:w-[33vw]'>
          <Card className='px-4 py-7'>
            <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-lg md:text-xl text-icons'>
              Queues
            </CardTitle>
            <CardContent className='flex flex-col gap-6 px-0'>
              {queues.map((q) => (
                <div key={q.text} className='flex gap-4 items-center'>
                  <div
                    className={cn("md:w-[5.5vw] font-medium", `${q.textColor}`)}
                  >
                    {q.title}
                  </div>
                  <div className='font-semibold text-sm'>{q.text}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className='px-4 py-7'>
            <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-xl text-icons'>
              Live Operations
            </CardTitle>
            <CardContent className='flex flex-col px-0 min-h-80'>
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No information found</EmptyTitle>
                </EmptyHeader>
              </Empty>
              {/* {liveOperations.map((live, i) => (
                <div
                  className='flex items-center border-b last:border-b-0 p-4'
                  key={i}
                >
                  <div className='flex flex-col gap-1 font-heebo flex-1'>
                    <p className='text-icons text-sm'>Type</p>
                    <p className='text-black text-base'>{live.type}</p>
                  </div>
                  <div className='flex flex-col gap-1 font-heebo flex-1'>
                    <p className='text-icons text-sm'>Customer</p>
                    <p className='text-black text-base'>{live.customer}</p>
                  </div>
                  <div className='flex flex-col gap-1 font-heebo flex-1'>
                    <p className='text-icons text-sm'>Driver</p>
                    <p className='text-black text-base'>{live.driver}</p>
                  </div>
                </div>
              ))} */}
            </CardContent>
          </Card>
        </div>
        <div className='flex gap-4 md:gap-8 flex-col flex-1'>
          <Card className='px-4 py-7 gap-1 '>
            <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-lg md:text-xl text-icons'>
              Live heatmap
            </CardTitle>
            <CardContent className='px-0 h-62.5'></CardContent>
          </Card>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-wrap'>
            <Card className='px-4 py-7 gap-1'>
              <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-lg md:text-xl text-icons'>
                Active trips
              </CardTitle>
              <CardContent className='px-0'>
                <p className='font-bold text-4xl'>0</p>
              </CardContent>
            </Card>
            <Card className='px-4 py-7 gap-1'>
              <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-lg md:text-xl text-icons'>
                Scheduled Trips
              </CardTitle>
              <CardContent className='px-0'>
                <p className='font-bold text-4xl'>0</p>
              </CardContent>
            </Card>
            <Card className='px-4 py-7 gap-1'>
              <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-lg md:text-xl text-icons'>
                Rush SLA Met
              </CardTitle>
              <CardContent className='px-0'>
                <p className='font-bold text-4xl'>0%</p>
              </CardContent>
            </Card>
            <Card className='px-4 py-7 gap-1 '>
              <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-lg md:text-xl text-icons'>
                Open SOS
              </CardTitle>
              <CardContent className='px-0'>
                <p className='font-bold text-4xl'>0</p>
              </CardContent>
            </Card>
          </div>
          <Card className='px-4 py-7 bg-icons text-white'>
            <CardTitle className='p-0 m-0 text-left font-heebo font-medium text-lg md:text-xl text-white'>
              Ad Notification
            </CardTitle>
            <CardContent className='px-0 flex flex-col gap-2'>
              {notifications.map((notification) => (
                <p key={notification} className=''>
                  {notification}
                </p>
              ))}
              <Button
                variant='outline'
                className='border-white rounded-full bg-transparent mt-4'
              >
                Edit entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default Page;

const queues = [
  {
    title: "Rush",
    textColor: "text-[#A90404]",
    badgeColor: "bg-[#FFD3CD]",
    text: "0 requests approaching SLA",
  },
  {
    textColor: "text-[#6A8200]",
    badgeColor: "bg-[#EDFF9D]",
    text: "0 need assignment in 48h",
    title: "Scheduled",
  },
  {
    textColor: "text-[#000000]",
    badgeColor: "bg-[#FD6E58]",
    text: "0 awaiting approval",
    title: "Refunds",
  },
];

const liveOperations = [
  {
    type: "Rental",
    customer: "Anna Camron",
    driver: "Mark Spencer",
  },
  {
    type: "Schedule",
    customer: "Anna Camron",
    driver: "Mark Spencer",
  },
  {
    type: "Schedule",
    customer: "Anna Camron",
    driver: "Mark Spencer",
  },
  {
    type: "Rental",
    customer: "Anna Camron",
    driver: "Mark Spencer",
  },
  {
    type: "Rental",
    customer: "Anna Camron",
    driver: "Mark Spencer",
  },
  {
    type: "Schedule",
    customer: "Anna Camron",
    driver: "Mark Spencer",
  },
  {
    type: "Schedule",
    customer: "Anna Camron",
    driver: "Mark Spencer",
  },
];

const notifications = [
  `· Promo BACK2UNI live in Manchester corridor.`,
  `. Driver docs sweep completed; 4 suspensions for expired insurance.`,
  `. Shared capacity increased in Zone C for evening peak.`,
];
