"use client";
import { cn } from "@/lib";
import { WhiteGreaterThanIcon } from "@public/svgs";
import { useRouter } from "next/navigation";

type Props = {
  continuePath: string;
  backActive: boolean;
  continueActive: boolean;
};
export const AuthBackAndContinueButton = ({
  continueActive,
  backActive,
  continuePath,
}: Props) => {
  const router = useRouter();
  return (
    <div className='flex justify-between items-center'>
      <button
        onClick={() => {
          if (backActive) router.back();
        }}
        className='flex gap-3 items-center cursor-pointer'
      >
        <div className='flex justify-center items-center rounded-full bg-primary w-14 aspect-square rotate-180'>
          <WhiteGreaterThanIcon />
        </div>
        <p className='text-sm'>Back</p>
      </button>
      <button
        onClick={() => {
          if (continueActive) router.push(continuePath);
        }}
        className={cn(
          "flex gap-3 items-center cursor-pointer",
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
      </button>
    </div>
  );
};
