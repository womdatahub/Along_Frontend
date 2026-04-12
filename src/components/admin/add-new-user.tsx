"use client";

import {
  // Dispatch, SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Button,
  // Checkbox,
  Separator,
  AddInput,
  SelectDropdown,
} from "@/components";

import {
  Check,
  // ChevronDown, ChevronUp
} from "lucide-react";
import {
  createNewAdminSchema,
  TCreateNewAdminSchema,
} from "@/lib/schemas/adminDBSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdmin, usePermission } from "@/store";
import { useShallow } from "zustand/shallow";

type Step = 1 | 2 | 3;

const StepCircle = ({ n, current }: { n: number; current: Step }) => {
  if (n < current) {
    return (
      <div className='size-3 md:size-4 rounded-full shrink-0 flex items-center justify-center bg-[#0f766e]'>
        <Check size={10} strokeWidth={3} className='text-white' />
      </div>
    );
  }
  if (n === current) {
    return (
      <div className='size-3 md:size-4 rounded-full shrink-0 bg-primary' />
    );
  }
  return <div className='size-3 md:size-4 rounded-full shrink-0 bg-gray-300' />;
};

const Sidebar = ({ current }: { current: Step }) => {
  const steps = [
    { n: 1 as const, label: "Basic" },
    // { n: 2 as const, label: "Roles and Permission" },
    { n: 2 as const, label: "Finish" },
  ];

  return (
    <div className='flex flex-row md:flex-col px-2 md:px-6 pt-8 md:pb-6 w-full md:max-w-48 md:min-w-48'>
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
};

// const tealCheckbox =
//   "h-[15px] w-[15px] rounded-sm border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]";

const StepBasic = ({
  onNext,
  onCancel,
}: {
  onNext: (values: TCreateNewAdminSchema) => void;
  onCancel: () => void;
}) => {
  const {
    register,
    handleSubmit,
    // setValue,
    // watch,
    control,
    formState: { errors },
  } = useForm<TCreateNewAdminSchema>({
    resolver: zodResolver(createNewAdminSchema),
  });
  // const role = watch("role");

  const { allRolePermissions } = usePermission(
    useShallow((state) => ({
      actions: state.actions,
      allRolePermissions: state.allRolePermissions,
    })),
  );

  const onSubmit = async (values: TCreateNewAdminSchema) => {
    onNext(values);
  };

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
            id='firstName'
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
            id='lastName'
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

        <div className='flex flex-col md:flex-row gap-4 mb-7'>
          <AddInput
            label='Email'
            id='email'
            errors={errors}
            placeholder='johndoe@gmail.com'
            register={register}
            required
            type='text'
            width='full'
            labelClassName='text-sm md:text-base font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-xl p-0'
            inputClassName='h-11 placeholder:text-placeholder rounded-xl text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
          <AddInput
            label='Phone number'
            id='mobileNumber'
            errors={errors}
            placeholder='+234 000 000 0000'
            register={register}
            required
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            width='full'
            labelClassName='text-sm md:text-base font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-xl p-0'
            inputClassName='h-11 placeholder:text-placeholder rounded-xl text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
        </div>

        <Controller
          name='role'
          control={control}
          render={({ field }) => (
            <SelectDropdown
              selected={field.value}
              setSelected={field.onChange}
              errorMessage={errors.role?.message}
              options={Object.keys(allRolePermissions ?? {}).map((role) =>
                role.split("_").join(" "),
              )}
              triggerLabel='Support Agent'
              triggerClassName='border  border-black/50 min-h-12 max-h-12 h-12'
              labelClassName='ml-2 text-sm md:text-base'
              label='Select role'
              groupClassName='shadow-lg'
            />
          )}
        />
      </div>

      <Separator />
      <div className='flex items-center justify-between px-8 py-4'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>Next</Button>
      </div>
    </>
  );
};

// const StepRoles = ({
//   onNext,
//   onBack,
//   selectedRole,
//   setSelectedRole,
// }: {
//   onNext: () => void;
//   onBack: () => void;
//   selectedRole: string;
//   setSelectedRole: Dispatch<SetStateAction<string>>;
// }) => {
//   const [opsOpen, setOpsOpen] = useState(true);

//   const { allRolePermissions } = usePermission(
//     useShallow((state) => ({
//       actions: state.actions,
//       allRolePermissions: state.allRolePermissions,
//     })),
//   );

//   return (
//     <>
//       <div className='flex-1 px-8 pt-8 pb-6 flex flex-col overflow-hidden'>
//         <h2 className='text-[22px] font-bold text-gray-900 leading-tight mb-1'>
//           Assign Roles and Permission
//         </h2>
//         <p className='text-[13px] text-gray-500 mb-6'>
//           Assign the Roles and permission you&apos;d like this user to have.
//         </p>

//         <div className='mb-1'>
//           <SelectDropdown
//             options={Object.keys(allRolePermissions ?? {}).map((role) =>
//               role.split("_").join(" "),
//             )}
//             selected={selectedRole}
//             setSelected={(role: string) => {
//               setSelectedRole(role);
//             }}
//             triggerLabel='Support Agent'
//             triggerClassName='border  border-black/50 min-h-12 max-h-12 h-12'
//             labelClassName='ml-2 text-sm md:text-base'
//             label='Select role'
//             groupClassName='shadow-lg'
//           />
//         </div>

//         <Separator className='my-5' />

//         <p className='text-sm md:text-base font-semibold text-gray-800 mb-3'>
//           Additional permission
//         </p>

//         <div className='flex-1 overflow-y-auto border-r border-gray-200 pr-3 -mr-3'>
//           {/* Operations */}
//           <div className='border-t border-gray-200'>
//             <button
//               type='button'
//               onClick={() => setOpsOpen((v) => !v)}
//               className='flex items-center justify-between w-full py-3 text-left'
//             >
//               <span className='text-[13px] text-gray-700'>Operations</span>
//               {opsOpen ? (
//                 <ChevronUp size={15} className='text-gray-400' />
//               ) : (
//                 <ChevronDown size={15} className='text-gray-400' />
//               )}
//             </button>
//             {opsOpen && (
//               <div className='flex flex-col gap-3 pb-4 pl-0.5'>
//                 <div className='flex items-center gap-2.5'>
//                   <Checkbox defaultChecked className={tealCheckbox} />
//                   <label className='text-[13px] text-gray-600'>
//                     Assign ride to riders
//                   </label>
//                 </div>
//                 <div className='flex items-center gap-2.5'>
//                   <Checkbox className={tealCheckbox} />
//                   <label className='text-[13px] text-gray-600'>
//                     Respond to queries
//                   </label>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Compliance */}
//           <div className='border-t border-gray-200'>
//             <button
//               type='button'
//               className='flex items-center justify-between w-full py-3 text-left'
//             >
//               <span className='text-[13px] text-gray-700'>Compliance</span>
//               <ChevronDown size={15} className='text-gray-400' />
//             </button>
//           </div>
//         </div>
//       </div>

//       <Separator />
//       <div className='flex items-center justify-between px-8 py-4'>
//         <Button
//           variant='outline'
//           onClick={onBack}
//           // className='h-10 px-6 rounded-xl text-[13px] font-medium text-gray-600 border-gray-300 hover:bg-gray-50'
//         >
//           Back
//         </Button>
//         <Button onClick={onNext}>Next</Button>
//       </div>
//     </>
//   );
// };

const StepReview = ({
  onBack,
  onFinish,
  details,
}: {
  onBack: () => void;
  onFinish: () => void;
  details: TCreateNewAdminSchema | undefined;
}) => {
  return (
    <>
      <div className='flex-1 px-8 pt-8 pb-6 flex flex-col overflow-hidden'>
        <h2 className='text-[26px] font-bold text-gray-900 mb-6'>Review</h2>

        <div className='flex-1 overflow-y-auto border-r border-gray-200 pr-3 -mr-3'>
          <div className='mb-4'>
            <p className='text-base font-semibold text-gray-800 mb-0.5'>Name</p>
            <p className='text-sm text-gray-600'>
              {details?.firstName} {details?.lastName}
            </p>
          </div>
          <Separator className='mb-4' />

          <div className='mb-4'>
            <p className='text-base font-semibold text-gray-800 mb-0.5'>
              Username
            </p>
            <p className='text-sm text-gray-600'>{details?.email}</p>
          </div>
          <Separator className='mb-4' />
          <div className='mb-4'>
            <p className='text-base font-semibold text-gray-800 mb-0.5'>
              Phone number
            </p>
            <p className='text-sm text-gray-600'>{details?.mobileNumber}</p>
          </div>
          <Separator className='mb-4' />

          <div>
            <p className='text-base font-semibold text-gray-800 mb-0.5'>
              Role and permissions
            </p>
            <p className='text-sm text-gray-600 mb-3'>
              {details?.role.toUpperCase()}
            </p>
            {/* <div className='flex flex-col gap-3'>
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
            </div> */}
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
};

const AddNewAdminModal = ({ trigger }: { trigger: React.ReactNode }) => {
  const [step, setStep] = useState<Step>(1);
  const [open, setOpen] = useState(false);
  const [newAdminDetails, setNewAdminDetails] =
    useState<TCreateNewAdminSchema>();

  const {
    actions: { getAllRolePermissions },
    allRolePermissions,
  } = usePermission(
    useShallow((state) => ({
      actions: state.actions,
      allRolePermissions: state.allRolePermissions,
    })),
  );

  const {
    actions: { createNewAdmin },
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
    })),
  );

  useEffect(() => {
    if (Object.keys(allRolePermissions ?? {}).length === 0) {
      getAllRolePermissions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const close = async () => {
    await createNewAdmin({
      ...newAdminDetails!,
      role: newAdminDetails!.role.split(" ").join("_").toUpperCase()!,
    });
    setOpen(false);
    setTimeout(() => setStep(1), 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        showCloseButton
        dialogTitle='Add New Admin'
        className='max-w-sm md:max-w-210 p-0 overflow-hidden rounded-2xl gap-0 [&>button]:hidden'
      >
        <div className='flex flex-col md:flex-row min-h-120'>
          <Sidebar current={step} />

          <div className='w-px bg-gray-200 hrink-0 hidden md:block' />

          <div className='flex-1 flex flex-col'>
            {step === 1 && (
              <StepBasic
                onNext={(values) => {
                  setNewAdminDetails(values);
                  setStep(2);
                }}
                onCancel={() => setOpen(false)}
              />
            )}
            {/* {step === 2 && (
              <StepRoles
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            )} */}
            {step === 2 && (
              <StepReview
                onBack={() => setStep(1)}
                onFinish={close}
                details={newAdminDetails}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddNewAdminModal };
