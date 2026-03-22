"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Button,
  Input,
  Checkbox,
  Separator,
} from "@/components";

import { Check, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

type Step = 1 | 2 | 3;

// ── Step circle indicator ──────────────────────────────────────────
function StepCircle({ n, current }: { n: number; current: Step }) {
  if (n < current) {
    return (
      <div className='w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center bg-[#0f766e]'>
        <Check size={10} strokeWidth={3} className='text-white' />
      </div>
    );
  }
  if (n === current) {
    return (
      <div className='w-[18px] h-[18px] rounded-full flex-shrink-0 bg-gray-800' />
    );
  }
  return (
    <div className='w-[18px] h-[18px] rounded-full flex-shrink-0 bg-gray-300' />
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
    <div className='w-[210px] flex-shrink-0 px-6 pt-8 pb-6'>
      {steps.map((s, i) => (
        <div key={s.n}>
          <div className='flex items-center gap-3'>
            <StepCircle n={s.n} current={current} />
            <span
              className={`text-[13px] leading-none ${
                s.n <= current
                  ? "text-gray-800 font-medium"
                  : "text-gray-400 font-normal"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className='w-px h-7 bg-gray-200 ml-[8.5px] my-1' />
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
  return (
    <>
      <div className='flex-1 px-8 pt-8 pb-6'>
        <h2 className='text-[22px] font-bold text-gray-900 leading-tight mb-1'>
          Add a new user
        </h2>
        <p className='text-[13px] text-gray-500 mb-7'>
          To get started, fill out some basic information about who you&apos;re
          adding as a user.
        </p>

        <div className='flex gap-4 mb-5'>
          <div className='flex-1'>
            <label className='block text-[13px] text-gray-500 mb-1.5'>
              First name
            </label>
            <Input
              defaultValue='Adewale'
              className='bg-[#f2f4f4] border-0 rounded-xl h-11 text-[13px] text-gray-700 focus-visible:ring-1 focus-visible:ring-teal-600 placeholder:text-gray-400'
            />
          </div>
          <div className='flex-1'>
            <label className='block text-[13px] text-gray-500 mb-1.5'>
              Last name
            </label>
            <Input
              defaultValue='Adewale'
              className='bg-[#f2f4f4] border-0 rounded-xl h-11 text-[13px] text-gray-700 focus-visible:ring-1 focus-visible:ring-teal-600 placeholder:text-gray-400'
            />
          </div>
        </div>

        <div className='mb-7'>
          <label className='block text-[13px] text-gray-500 mb-1.5'>
            Username
          </label>
          <Input
            defaultValue='whalesadd2334'
            className='bg-[#f2f4f4] border-0 rounded-xl h-11 text-[13px] text-gray-700 focus-visible:ring-1 focus-visible:ring-teal-600 placeholder:text-gray-400'
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
        <Button
          variant='outline'
          onClick={onCancel}
          className='h-10 px-6 rounded-xl text-[13px] font-medium text-gray-600 border-gray-300 hover:bg-gray-50'
        >
          Cancel
        </Button>
        <Button
          onClick={onNext}
          className='h-10 px-7 rounded-xl text-[13px] font-medium bg-[#b8cece] text-[#3a6868] border-0 hover:bg-[#a8c0c0] shadow-none'
        >
          Next
        </Button>
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
          <label className='block text-[13px] text-gray-500 mb-1.5'>
            Select role
          </label>
          <div className='flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors'>
            <span className='text-[13px] text-gray-700'>Support Agent</span>
            <ChevronRight size={15} className='text-gray-400' />
          </div>
        </div>

        <Separator className='my-5' />

        <p className='text-[13px] font-semibold text-gray-800 mb-3'>
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
          className='h-10 px-6 rounded-xl text-[13px] font-medium text-gray-600 border-gray-300 hover:bg-gray-50'
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className='h-10 px-7 rounded-xl text-[13px] font-medium bg-[#b8cece] text-[#3a6868] border-0 hover:bg-[#a8c0c0] shadow-none'
        >
          Next
        </Button>
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
            <p className='text-[13px] font-semibold text-gray-800 mb-0.5'>
              Name
            </p>
            <p className='text-[13px] text-gray-600'>Adewale Adewale</p>
          </div>
          <Separator className='mb-4' />

          <div className='mb-4'>
            <p className='text-[13px] font-semibold text-gray-800 mb-0.5'>
              Username
            </p>
            <p className='text-[13px] text-gray-600'>whalesadd2334</p>
          </div>
          <Separator className='mb-4' />

          <div>
            <p className='text-[13px] font-semibold text-gray-800 mb-0.5'>
              Role and permissions
            </p>
            <p className='text-[13px] text-gray-600 mb-3'>Support Agent</p>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2.5'>
                <Checkbox defaultChecked className={tealCheckbox} />
                <label className='text-[13px] text-gray-600'>
                  Assign ride to riders
                </label>
              </div>
              <div className='flex items-center gap-2.5'>
                <Checkbox defaultChecked className={tealCheckbox} />
                <label className='text-[13px] text-gray-600'>
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

// ── Main export ───────────────────────────────────────────────────
export function AddNewUserModal() {
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
      <DialogTrigger asChild>
        <Button className='bg-[#0f766e] hover:bg-[#0a6360] text-white'>
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-[840px] p-0 overflow-hidden rounded-2xl gap-0 [&>button]:hidden'>
        <div className='flex min-h-[480px]'>
          {/* Left sidebar */}
          <Sidebar current={step} />

          {/* Vertical divider */}
          <div className='w-px bg-gray-200 flex-shrink-0' />

          {/* Right content */}
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
}
