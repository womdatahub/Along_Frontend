import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { cn } from "@/lib";

type Props = {
  triggerLabel: string;
  options: string[];
  withoutIcon?: boolean;
  triggerClassName?: string;
};
export const SelectDropdown = ({
  triggerLabel,
  options,
  withoutIcon,
  triggerClassName,
}: Props) => {
  return (
    <Select>
      <SelectTrigger
        withoutIcon={withoutIcon}
        className={cn(
          "w-full bg-white min-h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0",
          triggerClassName
        )}
      >
        <SelectValue
          placeholder={triggerLabel}
          className='placeholder:text-placeholder'
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className='max-h-40'>
          {options.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
