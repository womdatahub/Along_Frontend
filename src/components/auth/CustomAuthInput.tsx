import { cn } from "@/lib";

type Props = { label: string; placeholder: string; className?: string };
export const CustomAuthInput = ({ label, placeholder, className }: Props) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className='font-semibold text-sm ml-5'>{label}</label>
      <input
        className='bg-white h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder'
        placeholder={placeholder}
      />
    </div>
  );
};
