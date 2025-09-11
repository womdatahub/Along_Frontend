import { cn } from "@/lib";

type Props = { children: React.ReactNode; className?: string };
export const HeadingHeebo = ({ children, className }: Props) => {
  return (
    <p
      className={cn("font-semibold font-heebo text-2xl text-center", className)}
    >
      {children}
    </p>
  );
};
