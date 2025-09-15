import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

type Props = {
  triggerLabel: string;
  options: string[];
};
export const SelectDropdown = ({ triggerLabel, options }: Props) => {
  return (
    <Select>
      <SelectTrigger className='w-full bg-white min-h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0'>
        <SelectValue
          placeholder={triggerLabel}
          className='placeholder:text-placeholder'
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
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
