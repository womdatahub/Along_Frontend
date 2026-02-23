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
  groupClassName?: string;
  selected: string;
  setSelected: (value: string) => void;
  disabled?: boolean;
  label?: string;
  errorMessage?: string;
  labelClassName?: string;
};
export const SelectDropdown = ({
  triggerLabel,
  options,
  withoutIcon,
  triggerClassName,
  groupClassName,
  selected,
  setSelected,
  disabled,
  label,
  errorMessage,
  labelClassName,
}: Props) => {
  return (
    <div className='flex flex-col gap-1'>
      <label className={cn("text-sm font-semibold ml-5", labelClassName)}>
        <span>{label}</span>
      </label>
      <Select onValueChange={setSelected} defaultValue={selected}>
        <SelectTrigger
          withoutIcon={withoutIcon}
          disabled={disabled}
          className={cn(
            "w-full bg-white min-h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0 capitalize",
            triggerClassName,
            errorMessage && "border border-red-400",
          )}
        >
          <SelectValue
            placeholder={triggerLabel}
            className='placeholder:text-placeholder capitalize'
          />
        </SelectTrigger>
        <SelectContent className='p-0'>
          <SelectGroup className={cn("max-h-40", groupClassName)}>
            {options.map((option) => {
              return (
                <SelectItem
                  key={option}
                  value={option.toLowerCase()}
                  className={cn("capitalize")}
                >
                  {option}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errorMessage && (
        <p className='text-xs text-red-400 ml-4'>{`${errorMessage}`}</p>
      )}
    </div>
  );
};
