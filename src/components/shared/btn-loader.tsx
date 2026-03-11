import { cn } from "@/lib";
import { Loader2Icon } from "lucide-react";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
};
export const BtnLoader = ({ isLoading, children, className }: Props) => {
  return (
    <div className='flex gap-4 justify-center items-center'>
      {children}
      {isLoading && <Loader2Icon className={cn("animate-spin", className)} />}
    </div>
  );
  // ) : (
  //   children
  // );
};
