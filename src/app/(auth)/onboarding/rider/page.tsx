"use client";

import {
  AddInput,
  AuthBackAndContinueButton,
  DatePicker,
  SelectDropdown,
} from "@/components";
import { TRegisterRiderValidator, registerRiderSchema } from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selected, setSelected] = useState<string>("");

  const router = useRouter();

  const {
    isLoading,
    userProfile,
    actions: { registerRider },
  } = useSession((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterRiderValidator>({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: userProfile?.mobileNumber ?? "",
    },
    resolver: zodResolver(registerRiderSchema),
  });

  const onSubmit = async (values: TRegisterRiderValidator) => {
    if (!date || !selected) return;
    const isSuccess = await registerRider({
      ...values,
      dateOfBirth: date.toISOString(),
      gender: selected as "male" | "female",
    });
    if (isSuccess === false) return;
    router.push("/rider");
  };

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Rider profile
          </h1>
          <p className="text-gray text-sm font-light">
            Tell us a bit about yourself
          </p>
        </div>

        <div className="bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm flex flex-col gap-6">
          {/* Role badge */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primaryLight2 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm text-black font-heebo">Rider</p>
              <p className="text-xs text-gray font-light">Personal account</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <AddInput
                id="firstName"
                errors={errors}
                placeholder="First name"
                register={register}
                disabled={false}
                required
                type="text"
                iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                label="First Name"
              />
              <AddInput
                id="lastName"
                errors={errors}
                placeholder="Last name"
                register={register}
                disabled={false}
                required
                type="text"
                iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                label="Last Name"
              />
            </div>
            <AddInput
              id="mobileNumber"
              errors={errors}
              placeholder="+1 000 000 0000"
              register={register}
              disabled={false}
              required
              type="text"
              iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
              label="Mobile Number"
              inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
            />

            <DatePicker
              date={date}
              open={open}
              setOpen={setOpen}
              setDate={setDate}
              label="Date of birth"
              placeholder="MM/DD/YYYY"
            />

            <div className="flex flex-col gap-1.5">
              <p className="font-medium text-sm ml-1 text-black">Gender</p>
              <SelectDropdown
                triggerLabel="Select gender"
                options={["Male", "Female"]}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </div>

          <AuthBackAndContinueButton
            backActive={!isLoading}
            continueActive={!isLoading && !!date && !!selected}
            continueFnc={handleSubmit(onSubmit)}
            continueIsLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
export default Page;
