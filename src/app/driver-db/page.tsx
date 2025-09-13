"use client";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  HeadingHeebo,
} from "@/components";
import { cn } from "@/lib";
import {
  AccuracyIcon,
  LocationPointerSvg,
  RemoveCardIcon,
  WhiteForwardIcon,
} from "@public/svgs";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
} from "recharts";

const Page = () => {
  return (
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 h-[calc(100vh-80px)] overflow-hidden'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 w-fit'>
          <HeadingHeebo className='text-left'>Quick trip</HeadingHeebo>
          <div className='flex items-center gap-8'>
            <div className='flex gap-4 items-center px-4 py-3 bg-white rounded-2xl'>
              <AccuracyIcon />
              <input
                className={cn(
                  "text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder w-full md:w-[375px]"
                )}
                placeholder='Pick up location'
              />
            </div>
            <Button
              variant={"default"}
              className='bg-transparent hover:bg-transparent shadow-none border-none cursor-pointer flex items-center gap-3 px-0'
            >
              <div className='bg-primary rounded-full size-10 flex items-center justify-center'>
                <WhiteForwardIcon />
              </div>
            </Button>
          </div>
        </div>
        <HeadingHeebo className='text-left mt-5'>Menu</HeadingHeebo>
        <div className='flex gap-10 items-stretch h-[calc(100vh-200px)]'>
          <div className='flex flex-col gap-10 border-r border-r-[#707072] pr-10 mb-32 w-fit whitespace-nowrap'>
            <div className='flex gap-2 justify-between flex-col'>
              <div className='flex flex-col gap-10'>
                <Link href={"/rider-db/ride-details"}>Vehicle</Link>
                <Link href={"/rider-db/ride-details"}>TBC</Link>
                <Link href={"/onboarding"}>Ride</Link>
              </div>
              <div className='flex items-center gap-3'>
                <p>Driver rating</p>
                <p>Star</p>
                <p>4.8%</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-20 overflow-y-auto mb-32'>
            <div className='flex flex-col gap-4 w-full md:max-w-1/3 '>
              <HeadingHeebo className='text-3xl text-left'>
                Start your day the right way
              </HeadingHeebo>
              <p className=''>
                Lets make the right match. Fill out the form to explore talent
                or opportunities that align perfectly with your goals
              </p>
              <Button className='w-fit rounded-full cursor-pointer'>
                Learn more
              </Button>
            </div>
            <div className='flex gap-3 flex-col'>
              <HeadingHeebo className='w-fit text-left'>Earnings</HeadingHeebo>

              {/* <Card className='flex flex-col gap-14 bg-[#1F364B] rounded-2xl justify-between w-full max-w-full md:w-fit border-0 shadow-none overflow-x-scroll'>
                <CardContent className='flex gap-5 overflow-x-auto px-0'>
                  <AreaChart
                    width={730}
                    height={250}
                    data={data}
                    margin={{ top: 0, right: 0, left: -50, bottom: 0 }} // remove chart margins
                  >
                    <defs>
                      <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#8884d8'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='#8884d8'
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#82ca9d'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='#82ca9d'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey='name' axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={false} />
                    <Tooltip />
                    <Area
                      type='monotone'
                      dataKey='uv'
                      stroke='#8884d8'
                      fillOpacity={1}
                      fill='url(#colorUv)'
                    />
                    <Area
                      type='monotone'
                      dataKey='pv'
                      stroke='#82ca9d'
                      fillOpacity={1}
                      fill='url(#colorPv)'
                    />
                  </AreaChart>
                </CardContent>
              </Card> */}
              <Card className='bg-[#1F364B] rounded-2xl border-0 shadow-none'>
                <CardContent className='px-0 overflow-x-auto'>
                  <div className='min-w-[730px]'>
                    <AreaChart
                      width={730}
                      height={250}
                      data={data}
                      margin={{ top: 0, right: 20, left: -50, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id='colorUv'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor='#8884d8'
                            stopOpacity={0.8}
                          />
                          <stop
                            offset='95%'
                            stopColor='#8884d8'
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey='name'
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#fff" }}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={false} />
                      <Tooltip
                        cursor={<CustomCursor stroke='#fff' />}
                        content={({ payload }) => {
                          if (!payload || !payload.length) return null;
                          return (
                            <div
                              style={{
                                position: "relative",
                                background: "white",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                color: "#000000",
                                fontSize: "12px",
                              }}
                            >
                              {payload[0].value}
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: -5,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  width: 0,
                                  height: 0,
                                  borderLeft: "5px solid transparent",
                                  borderRight: "5px solid transparent",
                                  borderTop: "5px solid white",
                                }}
                              />
                            </div>
                          );
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='uv'
                        stroke='#8884d8'
                        fillOpacity={1}
                        fill='url(#colorUv)'
                      />
                      <Area
                        type='monotone'
                        dataKey='pv'
                        stroke='#82ca9d'
                        fillOpacity={1}
                        fill='url(#colorPv)'
                      />
                    </AreaChart>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='flex flex-col gap-4 mr-5 w-full md:w-[260px] overflow-y-auto relative pb-32'>
            <HeadingHeebo className='text-left sticky top-0 bg-[#EFF1F1] pb-2'>
              Activities
            </HeadingHeebo>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div
                key={item}
                className='flex gap-3 pb-5 border-b border-b-[#D3D3D3]'
              >
                <div className='mt-5'>
                  <LocationPointerSvg />
                </div>
                <div className='flex flex-col font-heebo'>
                  <p className='text-[8px] font-medium'>Ride rental</p>
                  <HeadingHeebo className='text-left text-sm'>
                    Monte Calo Crescent, New Jersey
                  </HeadingHeebo>
                  <p className='text-[9px] text-icons flex gap-3'>
                    Mon 23, August 2025 <span>12 : 35</span>
                  </p>
                  <p className='text-green-600 text-[9px]'>Completed</p>
                  <HeadingHeebo className='text-left text-sm'>
                    $45.99
                  </HeadingHeebo>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;

const data = [
  {
    name: "",
    uv: 0,
  },
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 3490,
  },
  {
    name: "Page h",
    uv: 30,
  },
  {
    name: "Page i",
    uv: 3090,
  },
  {
    name: "Page j",
    uv: 340,
  },
];

interface CustomCursorProps {
  points?: { x: number; y: number }[];
  stroke?: string;
  chartHeight?: number; // optional, in case you want control
}

const CustomCursor: FC<CustomCursorProps> = ({
  points,
  stroke = "#fff",
  chartHeight = 250,
}) => {
  if (!points || points.length === 0) return null;

  const { x, y } = points[0];

  return (
    <line
      x1={x}
      y1={chartHeight} // bottom (x-axis)
      x2={x}
      y2={y} // stop at the hovered point
      stroke={stroke}
      strokeWidth={1}
      strokeDasharray='5 5'
    />
  );
};
