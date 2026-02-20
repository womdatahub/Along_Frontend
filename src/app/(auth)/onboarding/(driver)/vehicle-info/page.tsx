"use client";

import {
  AddInput,
  AuthBackAndContinueButton,
  SelectDropdown,
} from "@/components";
import { HeadingHeebo } from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/uploading-images-reusable-component";
import {
  TVehicleRegistrationSchemaValidator,
  vehicleRegistrationSchema,
} from "@/lib";
import { useSession } from "@/store";
import { ImageType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadImageIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const router = useRouter();
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >([null, null, null, null]);

  const {
    isLoading,
    registeredDriverResponseWithStripeDetails,
    actions: { uploadImages, registerVehicle },
  } = useSession(
    useShallow((state) => ({
      actions: state.actions,
      isLoading: state.isLoading,
      registeredDriverResponseWithStripeDetails:
        state.registeredDriverResponseWithStripeDetails,
    })),
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TVehicleRegistrationSchemaValidator>({
    defaultValues: {
      vehicleMake: "",
      vehicleModel: "",
      vehicleColor: "",
      vehicleIdentificationNumber: "",
      vehicleYear: "",
    },
    resolver: zodResolver(vehicleRegistrationSchema),
  });
  const vehicleMake = watch("vehicleMake");
  const vehicleModel = watch("vehicleModel");

  const onSubmit = async (v: TVehicleRegistrationSchemaValidator) => {
    if (previews.some((p) => p == null)) {
      toast.error("All images are required");
      return;
    }

    try {
      const uris: string[] = await Promise.all(
        previews.map((p) =>
          uploadImages({
            uploadType: "vehicle",
            imageFile: p!.image.imageFile,
          }),
        ),
      ).then((results) => {
        if (results.some((r) => !r)) {
          throw new Error("Upload failed");
        }
        return results as string[];
      });

      const isSuccess = await registerVehicle({
        ...v,
        vehicleFrontViewImageUri: uris[0],
        vehicleBackViewImageUri: uris[1],
        vehicleSideViewImageUri: uris[2],
        insuranceDocumentUri: uris[3],
      });

      if (!isSuccess) return;
      toast.success(
        "Vehicle information saved successfully! \n Redirecting you to set up your account details on Stripe. Cheers!",
        { duration: 4000, position: "top-center" },
      );
      setTimeout(() => {
        router.push(
          registeredDriverResponseWithStripeDetails?.stripeAccount
            .accountLink ??
            "https://connect.stripe.com/setup/e/acct_1T2pIx3kAZuormA4/BPUUzqETvXgb",
        );
      }, 3000); // this will redirect them to set up their account on stripe.
      // router.push("/onboarding/vehicle-insurance"); // this has not been implemented by backend so go to dashboard
      // router.push("/driver-db");
    } catch {
      toast.error("Image uploads failed!");
    }
  };

  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Vehicle Registration</HeadingHeebo>
        <p className='text-center text-sm'>
          Enter your car details to complete your registration and access
          related services{" "}
        </p>
      </div>
      <div className='flex flex-col gap-8'>
        <SelectDropdown
          options={Object.keys(CAR_MAKES)}
          selected={vehicleMake}
          setSelected={(value: string) => {
            setValue("vehicleMake", value);
            setValue("vehicleModel", "");
          }}
          triggerLabel='Tesla'
          label='Car Make'
          errorMessage={errors.vehicleMake?.message ?? ""}
        />

        <SelectDropdown
          options={CAR_MAKES[vehicleMake] ?? []}
          selected={vehicleModel}
          setSelected={(value: string) => setValue("vehicleModel", value)}
          triggerLabel='Model Y'
          label='Car Model'
          disabled={!vehicleMake}
          errorMessage={errors.vehicleModel?.message ?? ""}
        />

        <AddInput
          label='Car ID number'
          placeholder='1HGCM82633A004352'
          id='vehicleIdentificationNumber'
          errors={errors}
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />
        <div className='flex gap-4'>
          <AddInput
            label='Car color'
            placeholder='Beige white'
            id='vehicleColor'
            errors={errors}
            register={register}
            disabled={false}
            required
            type='text'
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />
          <AddInput
            label='Year'
            placeholder='2025'
            id='vehicleYear'
            errors={errors}
            register={register}
            disabled={false}
            required
            type='tel'
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />
        </div>
      </div>
      <div className='flex flex-col gap-8 mt-5 text-center'>
        <div className='flex flex-col gap-1'>
          <p className='font-bold text-base'>Car pictures</p>
          <p className='text-sm font-medium text-[#858585]'>
            Take and upload clear photos of your car’s front, side and back,
            registration and insurance. This helps verify your vehicle.
          </p>
        </div>
        <div className='flex gap-5'>
          <UploadingImagesReusableComponent
            key={0}
            index={0}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
          >
            <div className='flex gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Side front</p>
            </div>
          </UploadingImagesReusableComponent>
          <UploadingImagesReusableComponent
            key={1}
            index={1}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Back of the driver license'
          >
            <div className='flex gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Interior</p>
            </div>
          </UploadingImagesReusableComponent>
          <UploadingImagesReusableComponent
            key={2}
            index={2}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Back of the driver license'
          >
            <div className='flex gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Side rear</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm ml-5'>Car registration</label>
          <UploadingImagesReusableComponent
            key={3}
            index={3}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Upload Photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
      </div>
      <AuthBackAndContinueButton
        backActive={!isLoading}
        continueActive={!isLoading}
        continueFnc={handleSubmit(onSubmit)}
        continueIsLoading={isLoading}
      />
    </div>
  );
};
export default Page;

export const CAR_MAKES: Record<string, string[]> = {
  toyota: [
    "Camry",
    "Corolla",
    "RAV4",
    "Highlander",
    "Prius",
    "Land Cruiser",
    "Hilux",
    "Avalon",
  ],
  honda: ["Accord", "Civic", "CR-V", "Pilot", "Fit", "HR-V", "Odyssey"],
  ford: ["F-150", "Mustang", "Explorer", "Escape", "Edge", "Ranger"],
  bmw: ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7"],
  "mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "G-Class"],
  nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Navara"],
  hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
  kia: ["Rio", "Cerato", "Sportage", "Sorento", "Telluride"],
};
