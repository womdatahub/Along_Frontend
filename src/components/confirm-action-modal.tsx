"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  Separator,
  Button,
  AddInput,
  SelectDropdown,
} from "@/components";
import { cn, suspensionSchema, TSuspensionSchema } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";

import { X, MousePointerClick, Power } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type IconTypes = "delete" | "suspend" | "reactivate" | "reject-kyc";
const icons: Record<IconTypes, React.ReactNode> = {
  delete: <X className='text-red-500' size={32} />,
  suspend: <MousePointerClick className='text-red-500' size={32} />,
  reactivate: <Power className='text-[#D4D3F0]' size={32} />,
  "reject-kyc": <X className='text-red-500' size={32} />,
};
type Props = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmActionFunction: (values?: TSuspensionSchema) => void;
  type: IconTypes;
};
const ConfirmActionModal = ({
  trigger,
  title,
  description,
  confirmActionFunction,
  type = "delete",
}: Props) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm<TSuspensionSchema>({
    resolver: zodResolver(suspensionSchema),
  });

  const onSubmit = async (values: TSuspensionSchema) => {
    await confirmActionFunction(values);
    setOpen(false);
  };

  const suspensionType = watch("suspensionType");
  const suspensionDuration = watch("suspensionDuration");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        dialogTitle={`${type}-${title}-${description}?`}
        showCloseButton={false}
        className='max-w-sm overflow-hidden bg-[#E7EDED]'
      >
        <div className='flex flex-col items-center gap-2.5 text-center'>
          <div
            className={cn(
              "w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center",
              type === "reactivate" && "border-[#D4D3F0]",
            )}
          >
            {icons[type]}{" "}
          </div>
          <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
          <p className='text-xs'>{description}</p>
        </div>
        {type === "suspend" ||
          (type === "reject-kyc" && (
            <Separator className=' bg-[#768B8F38] mt-5' />
          ))}
        {type === "suspend" && (
          <div className='flex flex-col gap-2'>
            <AddInput
              label='Suspension Reason'
              id='reason'
              errors={errors}
              placeholder='Violation of'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              labelClassName='text-xs font-medium ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              withFocusRing
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <div className='flex gap-4 flex-col md:flex-row'>
              <SelectDropdown
                options={["TEMPORARY", "PERMANENT"]}
                selected={suspensionType ?? ""}
                setSelected={(value: string) => {
                  setValue("suspensionType", value);
                }}
                triggerLabel='TEMPORARY'
                triggerClassName='bg-background-1 min-h-14 h-12'
                labelClassName='ml-2'
                label='Suspension Type'
                groupClassName='shadow-lg'
                fullWidth
                errorMessage={errors.suspensionType?.message ?? ""}
              />
              <SelectDropdown
                options={Array(7)
                  .fill("")
                  .map((_, i) => `${i + 1}`)}
                selected={suspensionDuration ?? ""}
                setSelected={(value: string) => {
                  setValue("suspensionDuration", value);
                }}
                triggerLabel='1'
                triggerClassName='bg-background-1 min-h-14 h-12'
                labelClassName='ml-2'
                label='Suspension Duration'
                groupClassName='shadow-lg'
                fullWidth
                errorMessage={errors.suspensionDuration?.message ?? ""}
              />
            </div>
          </div>
        )}
        {type === "reject-kyc" && (
          <AddInput
            label='Rejection Reason'
            id='reason'
            errors={errors}
            placeholder='Violation of'
            register={register}
            required
            type='text'
            labelClassName='text-xs font-medium ml-0'
            iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
            withFocusRing
            inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
        )}
        <Separator className=' bg-[#768B8F38] mt-5' />
        <div className='flex'>
          <Button
            variant='ghost'
            className='flex-1 text-icons  hover:bg-transparent'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Separator
            orientation='vertical'
            className='h-12 self-center bg-[#768B8F38]'
          />
          <Button
            variant='ghost'
            className='flex-1 hover:bg-transparent text-red-500 hover:text-red-600'
            onClick={() => {
              if (type === "suspend" || type === "reject-kyc") {
                handleSubmit(onSubmit)();
                setOpen(false);
                return;
              }
              confirmActionFunction();
              setOpen(false);
            }}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export { ConfirmActionModal };
