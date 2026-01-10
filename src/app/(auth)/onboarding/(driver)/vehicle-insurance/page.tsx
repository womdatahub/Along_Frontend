"use client";

import {
  AddInput,
  AuthBackAndContinueButton,
  CustomAuthInput,
  HeadingHeebo,
} from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/uploading-images-reusable-component";
import { onboardingSchema, TOnboardingValidator } from "@/lib";
import { ImageType } from "@/types";
import { CalenderIcon, UploadImageIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Page = () => {
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >([null]);

  const {
    register,
    // handleSubmit,
    formState: { errors },
  } = useForm<TOnboardingValidator>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(onboardingSchema),
  });
  const router = useRouter();
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Vehicle Insurance</HeadingHeebo>
      </div>
      <div className='flex flex-col gap-8'>
        <CustomAuthInput
          label='Name of Insurance company'
          placeholder='American insurance'
        />
        <CustomAuthInput
          label='Insurance policy number'
          placeholder='00000000000000'
        />

        <div className='flex gap-4'>
          {/* <div className="flex flex-col gap-1 flex-1">
            <label className="font-semibold text-sm ml-5">
              Issued date
            </label>
            <Dialog open={issDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
              <DialogTrigger asChild>
                <div className="rounded-2xl max-w-[378px] bg-white items-center justify-between px-7 py-3 w-full flex gap-4 hover:cursor-pointer">
                  <p
                    className={cn(
                      "font-medium text-xs",
                      date ? "text-black" : "text-placeholder"
                    )}
                  >
                    {date
                      ? formatDateToDDMMYYYY(date as Date)
                      : "Choose a date"}
                  </p>
                  <CalenderIcon />
                </div>
              </DialogTrigger>

              <DialogContent
                className="w-fit p-0  rounded-[20px] overflow-hidden bg-background-1"
                showCloseButton={false}
              >
                <VisuallyHidden>
                  <DialogTitle>
                    Select a vehicle type: Economy, Comfort, Comfort XL, Luxury
                    or Luxury XL
                  </DialogTitle>
                </VisuallyHidden>
                <div className="flex flex-col bg-white">
                  <RentRideDialogComponent
                    title={formatDateToDDMMYYYY(
                      date ? (date as Date) : new Date()
                    )}
                    subTitle=""
                    isTitleCentered
                  >
                    <div className="flex flex-col gap-5 justify-center items-center bg-white w-fit pb-6 px-4">
                      <Calendar
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={setDate}
                        disabled={{
                          before: new Date(),
                        }}
                        className="bg-transparent"
                      />

                      <div className="flex gap-10 items-center font-bold">
                        <Button
                          onClick={() => setDate(new Date())}
                          className="bg-transparent hover:bg-transparent w-fit h-fit p-0 text-black"
                        >
                          CANCEL
                        </Button>
                        <Button
                          onClick={() => setIsDateDialogOpen(false)}
                          className="bg-transparent hover:bg-transparent w-fit h-fit p-0 text-primary"
                        >
                          SELECT
                        </Button>
                      </div>
                    </div>
                  </RentRideDialogComponent>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-semibold text-sm ml-5">
              Insurance document
            </label>
            <Dialog open={issDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
              <DialogTrigger asChild>
                <div className="rounded-2xl max-w-[378px] bg-white items-center justify-between px-7 py-3 w-full flex gap-4 hover:cursor-pointer">
                  <p
                    className={cn(
                      "font-medium text-xs",
                      date ? "text-black" : "text-placeholder"
                    )}
                  >
                    {date
                      ? formatDateToDDMMYYYY(date as Date)
                      : "Choose a date"}
                  </p>
                  <CalenderIcon />
                </div>
              </DialogTrigger>

              <DialogContent
                className="w-fit p-0  rounded-[20px] overflow-hidden bg-background-1"
                showCloseButton={false}
              >
                <VisuallyHidden>
                  <DialogTitle>
                    Select a vehicle type: Economy, Comfort, Comfort XL, Luxury
                    or Luxury XL
                  </DialogTitle>
                </VisuallyHidden>
                <div className="flex flex-col bg-white">
                  <RentRideDialogComponent
                    title={formatDateToDDMMYYYY(
                      date ? (date as Date) : new Date()
                    )}
                    subTitle=""
                    isTitleCentered
                  >
                    <div className="flex flex-col gap-5 justify-center items-center bg-white w-fit pb-6 px-4">
                      <Calendar
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={setDate}
                        disabled={{
                          before: new Date(),
                        }}
                        className="bg-transparent"
                      />

                      <div className="flex gap-10 items-center font-bold">
                        <Button
                          onClick={() => setDate(new Date())}
                          className="bg-transparent hover:bg-transparent w-fit h-fit p-0 text-black"
                        >
                          CANCEL
                        </Button>
                        <Button
                          onClick={() => setIsDateDialogOpen(false)}
                          className="bg-transparent hover:bg-transparent w-fit h-fit p-0 text-primary"
                        >
                          SELECT
                        </Button>
                      </div>
                    </div>
                  </RentRideDialogComponent>
                </div>
              </DialogContent>
            </Dialog>
          </div> */}
          <AddInput
            id='email'
            errors={errors}
            placeholder='Phone Number'
            register={register}
            disabled={false}
            required
            type='text'
            isReverse
            icon={<CalenderIcon />}
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16 px-2'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />

          <AddInput
            id='email'
            errors={errors}
            placeholder='Phone Number'
            register={register}
            disabled={false}
            required
            type='text'
            isReverse
            icon={<CalenderIcon />}
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16 px-2'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />
        </div>
      </div>
      <div className='flex flex-col gap-8 mb-8 text-center'>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm ml-5'>
            Insurance document
          </label>
          <UploadingImagesReusableComponent
            key={0}
            index={0}
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
        backActive
        continueActive={true}
        continueFnc={() => {
          router.push("/driver-db");
        }}
        // continuePath='/onboarding/driver-info'
      />
    </div>
  );
};
export default Page;
