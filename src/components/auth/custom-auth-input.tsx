import { cn } from "@/lib";

type Props = {
  label: string;
  placeholder: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
};
export const CustomAuthInput = ({
  label,
  placeholder,
  className,
  inputClassName,
  labelClassName,
}: Props) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className={cn("font-semibold text-sm ml-5", labelClassName)}>
        {label}
      </label>
      <input
        className={cn(
          "bg-white h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder",
          inputClassName
        )}
        placeholder={placeholder}
      />
    </div>
  );
};
