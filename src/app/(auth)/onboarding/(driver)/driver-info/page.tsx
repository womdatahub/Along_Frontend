"use client";
import {
  AddInput,
  AuthBackAndContinueButton,
} from "@/components";
import { cn, TDriverBasicInfoSchema } from "@/lib";
import { useSession } from "@/store";
import type { DriverProfile, UserProfile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { driverBasicInfoSchema } from "@/lib";
import { useShallow } from "zustand/shallow";
import { Car } from "lucide-react";

const Page = () => {
  const {
    currentUser,
    isLoading,
    actions: { registerDriver },
  } = useSession(
    useShallow((state) => ({
      actions: state.actions,
      currentUser: state.currentUser,
      isLoading: state.isLoading,
    })),
  );
  const userProfile = currentUser as UserProfile | undefined;
  const driverProfile = currentUser as DriverProfile | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<TDriverBasicInfoSchema>({
    resolver: zodResolver(driverBasicInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      firstEmergencyContact: "",
      secondEmergencyContact: "",
    },
  });

  const router = useRouter();
  const selectedGender = useWatch({ control, name: "gender" });

  const onSubmit = async (data: TDriverBasicInfoSchema) => {
    if (!driverProfile?.email && !userProfile?.email) {
      toast.error("User email not found. Please sign up again.");
      return;
    }

    const driverData = {
      ...data,
      email: driverProfile?.email || userProfile?.email,
    };

    const isSuccess = await registerDriver(driverData);

    if (!isSuccess) {
      toast.error("Failed to register driver. Please try again.");
      return;
    }
    router.push("/onboarding/services");
  };

  const genderOptions: { value: "male" | "female" | "other"; label: string }[] =
    [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ];

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Driver information
          </h1>
          <p className="text-gray text-sm font-light">
            Provide your basic details to get started
          </p>
        </div>

        <div className="bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm flex flex-col gap-6">
          {/* Role badge */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primaryLight2 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Car size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm text-black font-heebo">Driver</p>
              <p className="text-xs text-gray font-light">Step 1 of 4</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <AddInput
                label="First Name"
                id="firstName"
                errors={errors}
                placeholder="First name"
                register={register}
                disabled={isSubmitting || isLoading}
                required
                type="text"
                maxLength={50}
                iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
              <AddInput
                label="Last Name"
                id="lastName"
                errors={errors}
                placeholder="Last name"
                register={register}
                disabled={isSubmitting || isLoading}
                required
                type="text"
                maxLength={50}
                iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
            </div>

            <AddInput
              label="Date of Birth"
              id="dateOfBirth"
              errors={errors}
              placeholder="YYYY-MM-DD"
              register={register}
              disabled={isSubmitting || isLoading}
              required
              type="date"
              iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
              inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
            />

            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm ml-1 text-black">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("gender", option.value)}
                    className={cn(
                      "px-4 py-3.5 rounded-2xl bg-white border-2 transition-all duration-200 text-sm font-medium",
                      selectedGender === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-transparent hover:border-gray-2 text-gray-4",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-sm ml-1 text-black">
                Emergency Contacts
              </p>
              <div className="flex flex-col gap-3">
                <AddInput
                  label="Primary Contact"
                  id="firstEmergencyContact"
                  errors={errors}
                  placeholder="+1 (000) 000 0000"
                  register={register}
                  disabled={isSubmitting || isLoading}
                  required
                  type="tel"
                  maxLength={17}
                  iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                  inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                />
                <AddInput
                  label="Secondary Contact"
                  id="secondEmergencyContact"
                  errors={errors}
                  placeholder="+1 (000) 000 0000"
                  register={register}
                  disabled={isSubmitting || isLoading}
                  required
                  type="tel"
                  maxLength={17}
                  iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                  inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                />
              </div>
            </div>
          </div>

          <AuthBackAndContinueButton
            backActive={!isSubmitting && !isLoading}
            continueActive={!isSubmitting && !isLoading}
            continueFnc={handleSubmit(onSubmit)}
            continueIsLoading={isSubmitting || isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
