"use client";

import { AddInput, Button, HeadingHeebo } from "@/components";
import {
  TUpdateMobileNumberSchemaValidator,
  updateMobileNumberSchema,
} from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const router = useRouter();
  const {
    riderProfile,
    isLoading,
    actions: { updateRiderDetails },
  } = useSession(
    useShallow((state) => ({
      riderProfile: state.riderProfile,
      isLoading: state.isLoading,
      actions: state.actions,
    })),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUpdateMobileNumberSchemaValidator>({
    defaultValues: {
      firstName: riderProfile?.firstName ?? "",
      lastName: riderProfile?.lastName ?? "",
      mobileNumber: riderProfile?.mobileNumber ?? "",
      dateOfBirth: riderProfile?.dateOfBirth?.slice(0, 10) ?? "",
      gender:
        riderProfile?.gender === "other"
          ? "other"
          : (riderProfile?.gender ?? "male"),
    },
    resolver: zodResolver(updateMobileNumberSchema),
  });

  const onSubmit = async (values: TUpdateMobileNumberSchemaValidator) => {
    const updated = await updateRiderDetails({
      firstName: values.firstName,
      lastName: values.lastName,
      mobileNumber: values.mobileNumber,
      dateOfBirth: values.dateOfBirth ?? riderProfile?.dateOfBirth ?? "",
      gender: values.gender,
    });
    if (updated) router.push("/rider/account");
  };

  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">Edit profile</HeadingHeebo>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid gap-4 w-full md:w-111.5">
          <AddInput
            id="firstName"
            errors={errors}
            placeholder="First name"
            register={register}
            type="text"
            label="First name"
            maxLength={50}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-[45px]"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <AddInput
            id="lastName"
            errors={errors}
            placeholder="Last name"
            register={register}
            type="text"
            label="Last name"
            maxLength={50}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-[45px]"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <AddInput
            id="mobileNumber"
            errors={errors}
            placeholder="+1 (000) 000-0000"
            register={register}
            required
            type="tel"
            label="Phone number"
            maxLength={17}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-[45px]"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <AddInput
            id="dateOfBirth"
            errors={errors}
            placeholder="YYYY-MM-DD"
            register={register}
            type="date"
            label="Date of birth"
            iconAndInputWrapperClassName="bg-white rounded-2xl h-[45px]"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-full px-8 text-xs cursor-pointer w-fit"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
