import { Loader2Icon } from "lucide-react";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
};
export const BtnLoader = ({ isLoading, children }: Props) => {
  return isLoading ? <Loader2Icon className='animate-spin' /> : children;
};
