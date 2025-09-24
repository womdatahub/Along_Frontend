"use client";

import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

import { Input, Textarea } from "@/components";

import { cn } from "@/lib";
interface Props<T extends FieldValues> {
  id: Path<T>;
  type?: string;
  width?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder: string;
  errors: FieldErrors<T>;
  className?: string;
  extra?: React.ReactNode;
  register: UseFormRegister<T>;
  inputClassName?: string;
  onblur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  labelClassName?: string;
}

const AddInput = <T extends FieldValues>(props: Props<T>) => {
  const {
    id,
    type = "text",
    label,
    width,
    errors,
    disabled,
    register,
    required,
    placeholder,
    className,
    inputClassName,
    onblur,
    labelClassName,
  } = props;

  return (
    <div className={cn("flex flex-col gap-8", `w-${width}`, className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn("text-base flex gap-2 items-center", labelClassName)}
        >
          <span>{label}</span>
        </label>
      )}
      <div className='flex flex-col gap-1'>
        <Input
          id={id}
          type={type}
          disabled={disabled}
          {...register(id, { required })}
          onBlur={onblur}
          placeholder={placeholder}
          className={cn(
            "pl-5 rounded-lg",
            inputClassName,
            errors[id] && "border border-red-400"
          )}
        />
        {errors[id]?.message && (
          <p className='text-xs text-red-400 ml-4'>{`${errors[id].message}`}</p>
        )}
      </div>
    </div>
  );
};

export { AddInput };

const AddTextarea = <T extends FieldValues>(props: Props<T>) => {
  const {
    id,
    label,
    errors,
    disabled,
    register,
    required,
    placeholder,
    className,
    inputClassName,
  } = props;
  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <label htmlFor={id} className='text-base'>
        {label}
      </label>
      <Textarea
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={placeholder}
        className={cn(
          "pl-5 rounded-lg",
          inputClassName,
          errors[id] && "border border-red-400"
        )}
      />
      {errors[id]?.message && (
        <p className='text-xs text-red-400 ml-4'>{`${errors[id].message}`}</p>
      )}
    </div>
  );
};

export { AddTextarea };
