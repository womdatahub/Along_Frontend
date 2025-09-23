"use Client";

import { Card, CardContent } from "@/components";
import { FC } from "react";

import {
  Area,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  AreaChart,
} from "recharts";

const DriversChart = () => {
  return (
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
              <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
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
  );
};

export default DriversChart;

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
