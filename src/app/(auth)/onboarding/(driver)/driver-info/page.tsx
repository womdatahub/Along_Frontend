"use client";
import { AddInput, PhoneInput } from "@/components";
import { cn, TDriverBasicInfoSchema } from "@/lib";
import { useSession } from "@/store";
import type { DriverProfile, UserProfile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  useForm,
  useWatch,
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { toast } from "sonner";
import { driverBasicInfoSchema } from "@/lib";
import { useShallow } from "zustand/shallow";
import { Car, User } from "lucide-react";
import { AuthBackAndContinueButton } from "@/components";

const EmergencyContactCard = ({
  title,
  prefix,
  register,
  control,
  errors,
  disabled,
}: {
  title: string;
  prefix: "firstEmergencyContact" | "secondEmergencyContact";
  register: UseFormRegister<TDriverBasicInfoSchema>;
  control: Control<TDriverBasicInfoSchema, unknown>;
  errors: FieldErrors<TDriverBasicInfoSchema>;
  disabled: boolean;
}) => {
  const contactErrors = errors[prefix] as
    | { name?: { message?: string }; mobileNumber?: { message?: string } }
    | undefined;

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <User size={14} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-black">{title}</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm ml-1 text-black">
            Full Name
          </label>
          <div
            className={cn(
              "flex items-center gap-2 px-4 h-12 bg-background rounded-xl border transition-colors",
              contactErrors?.name ? "border-red-400" : "border-gray-200",
            )}
          >
            <User size={16} className="text-placeholder shrink-0" />
            <input
              {...register(`${prefix}.name`)}
              placeholder="Contact's full name"
              disabled={disabled}
              className="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
            />
          </div>
          {contactErrors?.name?.message && (
            <p className="text-xs text-red-500 ml-1 mt-0.5">
              {contactErrors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <Controller
          control={control}
          name={`${prefix}.mobileNumber`}
          render={({ field }) => (
            <PhoneInput
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={contactErrors?.mobileNumber?.message}
              label="Phone Number"
              disabled={disabled}
              iconAndInputWrapperClassName="bg-background rounded-xl h-12 border border-gray-200"
              inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
            />
          )}
        />
      </div>
    </div>
  );
};

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
      firstEmergencyContact: { name: "", mobileNumber: "" },
      secondEmergencyContact: { name: "", mobileNumber: "" },
    },
  });

  const router = useRouter();
  const selectedGender = useWatch({ control, name: "gender" });

  const cleanContact = (contact: { name: string; mobileNumber: string }) => {
    if (!contact.name.trim() && !contact.mobileNumber.trim()) return undefined;
    return contact;
  };

  const onSubmit = async (data: TDriverBasicInfoSchema) => {
    if (!driverProfile?.email && !userProfile?.email) {
      toast.error("User email not found. Please sign up again.");
      return;
    }

    const driverData = {
      ...data,
      firstEmergencyContact: cleanContact(data.firstEmergencyContact),
      secondEmergencyContact: cleanContact(data.secondEmergencyContact),
      email: driverProfile?.email || userProfile?.email,
    };

    const isSuccess = await registerDriver(driverData);

    if (!isSuccess) {
      toast.error("Failed to register driver. Please try again.");
      return;
    }
    router.push("/onboarding/documents");
  };

  const genderOptions: { value: "male" | "female" | "other"; label: string }[] =
    [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ];

  const disabled = isSubmitting || isLoading;

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
              <p className="text-xs text-gray font-light">Step 1 of 3</p>
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
                disabled={disabled}
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
                disabled={disabled}
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
              disabled={disabled}
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

            {/* Emergency Contacts */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between ml-1">
                <p className="font-medium text-sm text-black">
                  Emergency Contacts
                </p>
                <span className="text-xs text-gray bg-gray-100 px-2.5 py-0.5 rounded-full font-light">
                  Optional
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <EmergencyContactCard
                  title="Primary Contact"
                  prefix="firstEmergencyContact"
                  register={register}
                  control={control}
                  errors={errors}
                  disabled={disabled}
                />
                <EmergencyContactCard
                  title="Secondary Contact"
                  prefix="secondEmergencyContact"
                  register={register}
                  control={control}
                  errors={errors}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          <AuthBackAndContinueButton
            backActive={!disabled}
            continueActive={!disabled}
            continueFnc={handleSubmit(onSubmit)}
            continueIsLoading={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
