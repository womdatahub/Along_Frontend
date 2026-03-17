import { cn } from "@/lib";

type Props = {
  value: string;
  className?: string;
};
export const NameAvatar = ({ value, className }: Props) => {
  return (
    <div
      className={cn(
        "size-12 text-xl md:size-24 md:text-3xl font-semibold text-white rounded-full bg-primary flex items-center justify-center uppercase",
        className,
      )}
    >
      {value}
    </div>
  );
};
