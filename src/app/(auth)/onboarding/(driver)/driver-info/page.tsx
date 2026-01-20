"use client";
import {
  AddInput,
  AuthBackAndContinueButton,
  HeadingHeebo,
} from "@/components";
import { cn, TDriverBasicInfoSchema } from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { driverBasicInfoSchema } from "@/lib";

const Page = () => {
  const {
    userProfile,
    driverProfile,
    actions: { registerDriver },
  } = useSession((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TDriverBasicInfoSchema>({
    resolver: zodResolver(driverBasicInfoSchema),
    defaultValues: {
      firstName: "test",
      lastName: "tester",
      dateOfBirth: "",
      firstEmergencyContact: "09090909090",
      secondEmergencyContact: "09090909090",
    },
  });

  const router = useRouter();
  const selectedGender = watch("gender");

  const onSubmit = async (data: TDriverBasicInfoSchema) => {
    if (!driverProfile?.email && !userProfile?.email) {
      toast.error("User email not found. Please log in again.");
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

    toast.success("Driver information saved successfully!");
    router.push("/onboarding/services");
  };

  const genderOptions: { value: "male" | "female" | "other"; label: string }[] =
    [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ];

  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Driver Information</HeadingHeebo>
        <p className='text-center text-sm text-gray-600'>
          Please provide your basic information
        </p>
      </div>

      <form
        // onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-5'
      >
        <div className='flex gap-4'>
          <AddInput
            label='First Name'
            id='firstName'
            errors={errors}
            placeholder='Enter first name'
            register={register}
            disabled={isSubmitting}
            required
            type='text'
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />

          <AddInput
            label='Last Name'
            id='lastName'
            errors={errors}
            placeholder='Enter last name'
            register={register}
            disabled={isSubmitting}
            required
            type='text'
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
        </div>

        <AddInput
          label='Date of Birth'
          id='dateOfBirth'
          errors={errors}
          placeholder='Select date'
          register={register}
          disabled={isSubmitting}
          required
          type='date'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
        />

        <div className='flex flex-col gap-2'>
          <label className='font-semibold text-sm ml-5'>
            Gender <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-3'>
            {genderOptions.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => setValue("gender", option.value)}
                className={cn(
                  "flex-1 px-4 py-4 rounded-2xl bg-white border-2 border-transparent transition-all duration-200 text-sm font-medium",
                  selectedGender === option.value
                    ? "border-primary bg-primary/5"
                    : "hover:border-gray-300",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className='text-red-500 text-xs ml-5'>{errors.gender.message}</p>
          )}
        </div>

        <AddInput
          label='First Emergency Contact'
          id='firstEmergencyContact'
          errors={errors}
          placeholder='+234 000 000 0000'
          register={register}
          disabled={isSubmitting}
          required
          type='tel'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
        />

        <AddInput
          label='Second Emergency Contact'
          id='secondEmergencyContact'
          errors={errors}
          placeholder='+234 000 000 0000'
          register={register}
          disabled={isSubmitting}
          required
          type='tel'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
        />

        <AuthBackAndContinueButton
          backActive={!isSubmitting}
          continueActive={!isSubmitting}
          continueFnc={handleSubmit(onSubmit)}
        />
      </form>
    </div>
  );
};

export default Page;
