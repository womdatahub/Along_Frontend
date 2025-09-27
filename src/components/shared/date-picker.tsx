"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components";
import { Calendar } from "@/components";
import { Label } from "@/components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  label: string;
  placeholder: string;
};
export const DatePicker = ({
  date,
  open,
  setDate,
  setOpen,
  label,
  placeholder,
}: Props) => {
  return (
    <div className='flex flex-col gap-1'>
      <Label htmlFor='date' className='font-medium text-sm ml-5'>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='date'
            className={cn(
              "w-full justify-between font-normal placeholder:text-placeholder bg-white h-16 rounded-2xl px-4 text-sm hover:cursor-pointer focus:outline-none focus:ring-0 hover:bg-white",
              date ? "text-black" : "text-placeholder"
            )}
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            captionLayout='dropdown'
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
