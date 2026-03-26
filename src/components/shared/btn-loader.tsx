import { cn } from "@/lib";
import { Loader2Icon } from "lucide-react";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  shouldChildrenShowWhenSpinning?: boolean;
};
export const BtnLoader = ({
  isLoading,
  children,
  className,
  shouldChildrenShowWhenSpinning = false,
}: Props) => {
  return (
    <div className='flex gap-4 justify-center items-center'>
      {(!isLoading || shouldChildrenShowWhenSpinning) && children}
      {isLoading && <Loader2Icon className={cn("animate-spin", className)} />}
    </div>
  );
};

export const LoadingSpinner = ({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) => {
  return <Loader2Icon className={cn("animate-spin", className)} size={size} />;
};
