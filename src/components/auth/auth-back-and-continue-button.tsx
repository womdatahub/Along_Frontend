"use client";
import { cn } from "@/lib";
import { WhiteGreaterThanIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { Button } from "@/components";

type Props = {
  continueFnc: () => void;
  backActive: boolean;
  continueActive: boolean;
};
export const AuthBackAndContinueButton = ({
  continueActive,
  backActive,
  continueFnc,
}: Props) => {
  const router = useRouter();
  return (
    <div className='flex justify-between items-center'>
      <Button
        onClick={() => {
          if (backActive) router.back();
        }}
        className='flex gap-3 items-center cursor-pointer bg-transparent text-black hover:bg-transparent border-0 shadow-none'
      >
        <div
          className={cn(
            "flex justify-center items-center rounded-full bg-primary w-14 aspect-square rotate-180",
            backActive ? "bg-primary" : "bg-inactive"
          )}
        >
          <WhiteGreaterThanIcon />
        </div>
        <p className='text-sm'>Back</p>
      </Button>
      <Button
        onClick={() => {
          if (continueActive) continueFnc();
        }}
        className={cn(
          "flex gap-3 items-center cursor-pointer bg-transparent text-black hover:bg-transparent border-0 shadow-none",
          !continueActive && "cursor-not-allowed"
        )}
      >
        <p className='text-sm'>Continue</p>
        <div
          className={cn(
            "flex justify-center items-center rounded-full w-14 aspect-square transition-colors duration-500 bg-primary",
            continueActive ? "bg-primary" : "bg-inactive"
          )}
        >
          <WhiteGreaterThanIcon />
        </div>
      </Button>
    </div>
  );
};
