"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Button,
  Checkbox,
  Separator,
  AddInput,
  SelectDropdown,
} from "@/components";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  marketPlaceSchema,
  TMarketPlaceSchema,
} from "@/lib/schemas/adminDBSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";

type Step = 1 | 2 | 3;

// ── Step circle indicator ──────────────────────────────────────────
function StepCircle({ n, current }: { n: number; current: Step }) {
  if (n < current) {
    return (
      <div className='size-3 md:size-4 rounded-full flex-shrink-0 flex items-center justify-center bg-[#0f766e]'>
        <Check size={10} strokeWidth={3} className='text-white' />
      </div>
    );
  }
  if (n === current) {
    return (
      <div className='size-3 md:size-4 rounded-full flex-shrink-0 bg-primary' />
    );
  }
  return (
    <div className='size-3 md:size-4 rounded-full flex-shrink-0 bg-gray-300' />
  );
}

// ── Left sidebar ───────────────────────────────────────────────────
function Sidebar({ current }: { current: Step }) {
  const steps = [
    { n: 1 as const, label: "Basic" },
    { n: 2 as const, label: "Roles and Permission" },
    { n: 3 as const, label: "Finish" },
  ];

  return (
    <div className='flex flex-row md:flex-col px-2 md:px-6 pt-8 md:pb-6 w-full md:w-fit'>
      {steps.map((s, i) => (
        <div
          key={s.n}
          className='flex items-center md:items-start md:flex-col gap-2 mb-6 md:last:mb-0'
        >
          <div className='flex items-center gap-1 md:gap-3'>
            <StepCircle n={s.n} current={current} />
            <span
              className={`text-xs md:text-sm leading-none ${
                s.n <= current
                  ? "text-gray-800 font-medium"
                  : "text-gray-400 font-normal"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className='w-4 h-px md:w-px md:h-7  bg-gray-200 ml-[8.5px] my-1' />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Shared teal checkbox className ────────────────────────────────
const tealCheckbox =
  "h-[15px] w-[15px] rounded-sm border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]";

// ── Step 1: Basic ─────────────────────────────────────────────────
function StepBasic({
  onNext,
  onCancel,
}: {
  onNext: () => void;
  onCancel: () => void;
}) {
  const {
    register,
    formState: { errors },
  } = useForm<TMarketPlaceSchema>({
    resolver: zodResolver(marketPlaceSchema),
  });

  return (
    <>
      <div className='flex-1 px-4 md:px-8 pt-8 pb-6'>
        <h2 className='text-[22px] font-bold text-gray-900 leading-tight mb-1'>
          Add a new user
        </h2>
        <p className='text-[13px] text-gray-500 mb-7'>
          To get started, fill out some basic information about who you&apos;re
          adding as a user.
        </p>

        <div className='flex flex-col md:flex-row gap-4 mb-5'>
          <AddInput
            label='First name'
            id='title'
            errors={errors}
            placeholder='Adewale'
            register={register}
            required
            type='text'
            width='full'
            labelClassName='text-sm md:text-base font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-xl p-0'
            inputClassName='h-11 placeholder:text-placeholder rounded-xl text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
          <AddInput
            label='Last name'
            id='title'
            errors={errors}
            placeholder='Adewale'
            register={register}
            required
            type='text'
            width='full'
            labelClassName='text-sm md:text-base font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-xl p-0'
            inputClassName='h-11 placeholder:text-placeholder rounded-xl text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
        </div>

        <div className='mb-7'>
          <AddInput
            label='Username'
            id='title'
            errors={errors}
            placeholder='Adewale'
            register={register}
            required
            type='text'
            width='full'
            labelClassName='text-sm md:text-base font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-xl p-0'
            inputClassName='h-11 placeholder:text-placeholder rounded-xl text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
        </div>

        <div className='flex flex-col gap-3.5'>
          <div className='flex items-center gap-3'>
            <Checkbox id='auto-pwd' defaultChecked className={tealCheckbox} />
            <label
              htmlFor='auto-pwd'
              className='text-[13px] text-gray-700 cursor-pointer'
            >
              Automatically generate password
            </label>
          </div>
          <div className='flex items-center gap-3'>
            <Checkbox id='req-change' defaultChecked className={tealCheckbox} />
            <label
              htmlFor='req-change'
              className='text-[13px] text-gray-700 cursor-pointer'
            >
              Require user to change their password when they first sign in
            </label>
          </div>
        </div>
      </div>

      <Separator />
      <div className='flex items-center justify-between px-8 py-4'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </>
  );
}

// ── Step 2: Roles and Permission ──────────────────────────────────
function StepRoles({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [opsOpen, setOpsOpen] = useState(true);

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<TMarketPlaceSchema>({
    resolver: zodResolver(marketPlaceSchema),
  });

  return (
    <>
      <div className='flex-1 px-8 pt-8 pb-6 flex flex-col overflow-hidden'>
        <h2 className='text-[22px] font-bold text-gray-900 leading-tight mb-1'>
          Assign Roles and Permission
        </h2>
        <p className='text-[13px] text-gray-500 mb-6'>
          Assign the Roles and permission you&apos;d like this user to have.
        </p>

        <div className='mb-1'>
          <SelectDropdown
            options={["Support Agent", "Support Agent2"]}
            selected={""}
            setSelected={(value: string) => {
              // setValue("currency", value);
            }}
            triggerLabel='Support Agent'
            triggerClassName='border  border-black/50 min-h-12 max-h-12 h-12'
            labelClassName='ml-2 text-sm md:text-base'
            label='Select role'
            groupClassName='shadow-lg'
            // errorMessage={errors.currency?.message ?? ""}
          />
        </div>

        <Separator className='my-5' />

        <p className='text-sm md:text-base font-semibold text-gray-800 mb-3'>
          Additional permission
        </p>

        <div className='flex-1 overflow-y-auto border-r border-gray-200 pr-3 -mr-3'>
          {/* Operations */}
          <div className='border-t border-gray-200'>
            <button
              type='button'
              onClick={() => setOpsOpen((v) => !v)}
              className='flex items-center justify-between w-full py-3 text-left'
            >
              <span className='text-[13px] text-gray-700'>Operations</span>
              {opsOpen ? (
                <ChevronUp size={15} className='text-gray-400' />
              ) : (
                <ChevronDown size={15} className='text-gray-400' />
              )}
            </button>
            {opsOpen && (
              <div className='flex flex-col gap-3 pb-4 pl-0.5'>
                <div className='flex items-center gap-2.5'>
                  <Checkbox defaultChecked className={tealCheckbox} />
                  <label className='text-[13px] text-gray-600'>
                    Assign ride to riders
                  </label>
                </div>
                <div className='flex items-center gap-2.5'>
                  <Checkbox className={tealCheckbox} />
                  <label className='text-[13px] text-gray-600'>
                    Respond to queries
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Compliance */}
          <div className='border-t border-gray-200'>
            <button
              type='button'
              className='flex items-center justify-between w-full py-3 text-left'
            >
              <span className='text-[13px] text-gray-700'>Compliance</span>
              <ChevronDown size={15} className='text-gray-400' />
            </button>
          </div>
        </div>
      </div>

      <Separator />
      <div className='flex items-center justify-between px-8 py-4'>
        <Button
          variant='outline'
          onClick={onBack}
          // className='h-10 px-6 rounded-xl text-[13px] font-medium text-gray-600 border-gray-300 hover:bg-gray-50'
        >
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </>
  );
}

// ── Step 3: Review ────────────────────────────────────────────────
function StepReview({
  onBack,
  onFinish,
}: {
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <>
      <div className='flex-1 px-8 pt-8 pb-6 flex flex-col overflow-hidden'>
        <h2 className='text-[26px] font-bold text-gray-900 mb-6'>Review</h2>

        <div className='flex-1 overflow-y-auto border-r border-gray-200 pr-3 -mr-3'>
          <div className='mb-4'>
            <p className='text-base font-semibold text-gray-800 mb-0.5'>Name</p>
            <p className='text-sm text-gray-600'>Adewale Adewale</p>
          </div>
          <Separator className='mb-4' />

          <div className='mb-4'>
            <p className='text-base font-semibold text-gray-800 mb-0.5'>
              Username
            </p>
            <p className='text-sm text-gray-600'>whalesadd2334</p>
          </div>
          <Separator className='mb-4' />

          <div>
            <p className='text-base font-semibold text-gray-800 mb-0.5'>
              Role and permissions
            </p>
            <p className='text-sm text-gray-600 mb-3'>Support Agent</p>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2.5'>
                <Checkbox defaultChecked className={tealCheckbox} />
                <label className='text-sm text-gray-600'>
                  Assign ride to riders
                </label>
              </div>
              <div className='flex items-center gap-2.5'>
                <Checkbox defaultChecked className={tealCheckbox} />
                <label className='text-sm text-gray-600'>
                  Respond to queries
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />
      <div className='flex items-center justify-between px-8 py-4'>
        <Button
          variant='outline'
          onClick={onBack}
          className='h-10 px-7 rounded-full text-[13px] font-medium text-gray-600 border-gray-300 hover:bg-gray-50'
        >
          Back
        </Button>
        <Button
          onClick={onFinish}
          className='h-10 px-7 rounded-full text-[13px] font-medium bg-[#0f766e] text-white hover:bg-[#0a6360] shadow-none'
        >
          Finish
        </Button>
      </div>
    </>
  );
}

const AddNewUserModal = ({ trigger }: { trigger: React.ReactNode }) => {
  const [step, setStep] = useState<Step>(1);
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    setTimeout(() => setStep(1), 300);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) close();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className='max-w-sm md:max-w-[840px] p-0 overflow-hidden rounded-2xl gap-0 [&>button]:hidden'>
        <div className='flex flex-col md:flex-row min-h-[480px]'>
          <Sidebar current={step} />

          <div className='w-px bg-gray-200 flex-shrink-0 hidden md:block' />

          <div className='flex-1 flex flex-col'>
            {step === 1 && (
              <StepBasic onNext={() => setStep(2)} onCancel={close} />
            )}
            {step === 2 && (
              <StepRoles onNext={() => setStep(3)} onBack={() => setStep(1)} />
            )}
            {step === 3 && (
              <StepReview onBack={() => setStep(2)} onFinish={close} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export { AddNewUserModal };
