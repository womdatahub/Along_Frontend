"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const tealCheckbox =
  "h-[15px] w-[15px] rounded-sm border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]";

const EditRolesPermissionModal = ({
  trigger,
}: {
  trigger: React.ReactNode;
}) => {
  const [opsOpen, setOpsOpen] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        dialogTitle='Edit Roles and Permission'
        className='max-w-sm md:max-w-[560px] p-8 gap-0 [&>button]:hidden'
      >
        {/* Header */}
        <h2 className='text-[20px] font-bold text-gray-900 leading-tight mb-1'>
          Edit roles and permission
        </h2>
        <p className='text-[13px] text-gray-500 mb-6'>
          Assign the Roles and permission you&apos;d like this user to have.
        </p>

        {/* Select role */}
        <div className='mb-5'>
          <label className='block text-[13px] text-gray-500 mb-1.5'>
            Select role
          </label>
          <div className='flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors'>
            <span className='text-[13px] text-gray-700'>Operation Manager</span>
            <ChevronRight size={15} className='text-gray-400' />
          </div>
        </div>

        {/* Additional permission */}
        <p className='text-[13px] font-semibold text-gray-800 mb-1'>
          Additional permission
        </p>

        {/* Scrollable accordion */}
        <div className='overflow-y-auto max-h-[240px] border-r border-gray-200 pr-3 -mr-3'>
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

          {/* Finance */}
          <div className='border-t border-gray-200'>
            <button
              type='button'
              className='flex items-center justify-between w-full py-3 text-left'
            >
              <span className='text-[13px] text-gray-700'>Finance</span>
              <ChevronDown size={15} className='text-gray-400' />
            </button>
          </div>
        </div>

        {/* Save */}
        <div className='mt-6'>
          <Button className='rounded-full'>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EditRolesPermissionModal };
