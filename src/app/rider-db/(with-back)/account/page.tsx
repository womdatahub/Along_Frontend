"use client";
import {
  Button,
  Card,
  CardContent,
  HeadingHeebo,
  NameAvatar,
  Switch,
} from "@/components";
import { cn } from "@/lib";
import { useSession } from "@/store";
import {  AshForwardIcon } from "@public/svgs";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const [active, setActive] = useState<"personal-info" | "security">(
    "personal-info",
  );

  const { riderProfile } = useSession(
    useShallow((state) => ({
      riderProfile: state.riderProfile,
      actions: state.actions,
    })),
  );


  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Profile</HeadingHeebo>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-4'>
          <Button
            onClick={() => setActive("personal-info")}
            className={cn(
              "text-sm text-gray-5 hover:text-primary bg-transparent hover:bg-transparent border-0 shadow-none cursor-pointer p-0 h-fit",
              active === "personal-info" && "text-primary font-bold underline",
            )}
          >
            Personal info
          </Button>
          <Button
            onClick={() => setActive("security")}
            className={cn(
              "text-sm text-gray-5 hover:text-primary bg-transparent hover:bg-transparent border-0 shadow-none cursor-pointer p-0 h-fit",
              active === "security" && "text-primary font-bold underline",
            )}
          >
            Security
          </Button>
        </div>
        <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
          {active === "personal-info" ? (
            <CardContent className='flex flex-col gap-8'>
              <div className='flex gap-6 items-center'>
                {/* <UploadingImagesReusableComponent
                  key={0}
                  index={0}
                  previews={[profilePhoto.preview]}
                  setPreviews={(newValue) => {
                    const value =
                      typeof newValue === "function"
                        ? newValue([profilePhoto.preview])
                        : newValue;
                    if (value[0])
                      handleFileSelect(value[0].image, setProfilePhoto);
                  }}
                  className='justify-center items-center rounded-full bg-[#FAFAFA] text-placeholder self-end size-24'
                  imageToastDescription='Profile image'
                >
                  <div className='flex flex-col gap-2 justify-center items-center'>
                    <p className='text-sm font-medium'>Profile photo</p>
                  </div>
                </UploadingImagesReusableComponent> */}
                <NameAvatar
                  value={`${riderProfile?.firstName[0] ?? ""} ${riderProfile?.lastName[0] ?? ""}`}
                />
                <p className='text-lg font-heebo'>
                  {riderProfile?.firstName} {riderProfile?.lastName}
                </p>
              </div>
              <div className='flex gap-4 flex-col'>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-gray-5'>Phone number</p>
                    <p className='font-semibold'>
                      {riderProfile?.mobileNumber}
                    </p>
                  </div>
                </ContainerWithArrow>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-gray-5'>Email address</p>
                    <p className='font-semibold'>{riderProfile?.email}</p>
                  </div>
                </ContainerWithArrow>

                <ContainerWithArrow withoutBottomBorder>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-gray-5'>Address</p>
                    <p className='font-semibold'>Cabbagetown, Candeler Park</p>
                  </div>
                </ContainerWithArrow>
              </div>
            </CardContent>
          ) : (
            <CardContent className='flex flex-col gap-8'>
              <div className='flex gap-4 flex-col'>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-gray-5'>Password</p>
                    <p className='font-semibold'>******************</p>
                  </div>
                </ContainerWithArrow>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-gray-5'>
                      Enable 2-step verification
                    </p>
                    <p className='font-semibold'>
                      Add additional security to you account
                    </p>
                  </div>
                </ContainerWithArrow>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-gray-5'>Passkeys</p>
                    <p className='font-semibold'>Set up passkey</p>
                  </div>
                </ContainerWithArrow>
                <div className='flex gap-1 justify-between font-heebo text-black text-sm pb-4'>
                  <p className='font-semibold'>Notification</p>
                  <Switch color='primary' checked />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
export default Page;

const ContainerWithArrow = ({
  children,
  withoutBottomBorder,
}: {
  children: React.ReactNode;
  withoutBottomBorder?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b",
        withoutBottomBorder && "border-b-0",
      )}
    >
      {children}
      <AshForwardIcon />
    </div>
  );
};
