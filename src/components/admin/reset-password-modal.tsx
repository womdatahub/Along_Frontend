"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy } from "lucide-react";

type ResetState = "input" | "confirmation";

const tealCheckbox =
  "h-[15px] w-[15px] rounded-sm border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]";

const ResetPasswordModal = ({ trigger }: { trigger: React.ReactNode }) => {
  const [state, setState] = useState<ResetState>("input");
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    setTimeout(() => setState("input"), 300);
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

      <DialogContent className='max-w-[460px] rounded-2xl p-8 gap-0 [&>button]:hidden'>
        {state === "input" ? (
          <>
            <h2 className='text-[20px] font-bold text-gray-900 mb-7'>
              Reset Password
            </h2>

            {/* Generate Password button — large, light gray-teal bg */}
            <button
              type='button'
              className='w-full py-5 rounded-xl bg-[#e8f0f0] text-[13px] text-gray-500 hover:bg-[#dce9e9] transition-colors mb-4 text-center'
            >
              Generate Password
            </button>

            {/* Type Password input */}
            <div className='mb-5'>
              <Input
                placeholder='Type Password'
                className='h-11 rounded-xl border border-gray-300 text-[13px] placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-teal-600'
              />
            </div>

            {/* Checkbox */}
            <div className='flex items-center gap-3 mb-8'>
              <Checkbox defaultChecked className={tealCheckbox} />
              <label className='text-[13px] text-gray-700'>
                Require user to change their password when they first sign in
              </label>
            </div>

            {/* Continue */}
            <Button
              onClick={() => setState("confirmation")}
              className='h-10 px-8 rounded-full text-[13px] font-medium bg-[#6BBEBE] text-white hover:bg-[#5AADAD] shadow-none border-0'
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <h2 className='text-[20px] font-bold text-gray-900 mb-7'>
              Password reset confirmation
            </h2>

            <div className='mb-8'>
              <div className='flex items-center justify-between mb-1'>
                <p className='text-[13px] font-bold text-gray-900'>
                  Your New Password
                </p>
                <button
                  type='button'
                  className='flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 transition-colors'
                >
                  <Copy size={14} strokeWidth={1.5} />
                  Copy
                </button>
              </div>
              <p className='text-[13px] text-gray-700'>HK877yhyyf&amp;998hhh</p>
            </div>

            {/* Continue */}
            <Button
              onClick={close}
              className='h-10 px-8 rounded-full text-[13px] font-medium bg-[#0f766e] text-white hover:bg-[#0a6360] shadow-none border-0'
            >
              Continue
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export { ResetPasswordModal };
