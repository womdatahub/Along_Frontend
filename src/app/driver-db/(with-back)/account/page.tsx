"use client";
import { Button, Card, CardContent, HeadingHeebo, Switch } from "@/components";
import { cn } from "@/lib";
import { AshForwardIcon } from "@public/svgs";
import { useState } from "react";

const Page = () => {
  const [active, setActive] = useState<"personal-info" | "security">(
    "personal-info"
  );
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Manage Account</HeadingHeebo>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-4'>
          <Button
            onClick={() => setActive("personal-info")}
            className={cn(
              "text-sm text-[#707072] hover:text-primary bg-transparent hover:bg-transparent border-0 shadow-none cursor-pointer p-0 h-fit",
              active === "personal-info" && "text-primary font-bold underline"
            )}
          >
            Personal info
          </Button>
          <Button
            onClick={() => setActive("security")}
            className={cn(
              "text-sm text-[#707072] hover:text-primary bg-transparent hover:bg-transparent border-0 shadow-none cursor-pointer p-0 h-fit",
              active === "security" && "text-primary font-bold underline"
            )}
          >
            Security
          </Button>
        </div>
        <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
          {active === "personal-info" ? (
            <CardContent className='flex flex-col gap-8'>
              <div className='flex gap-6 items-center'>
                <div className='size-24 rounded-full bg-primary flex items-center justify-center' />
                <p className='text-lg font-heebo'>Michael Cynthia </p>
              </div>
              <div className='flex gap-4 flex-col'>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-[#707072]'>Phone number</p>
                    <p className='font-semibold'>+1 67 988 90098</p>
                  </div>
                </ContainerWithArrow>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-[#707072]'>Email address</p>
                    <p className='font-semibold'>michael.cynthia@gmail.com</p>
                  </div>
                </ContainerWithArrow>

                <ContainerWithArrow withoutBottomBorder>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-[#707072]'>Address</p>
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
                    <p className=' font-light text-[#707072]'>Password</p>
                    <p className='font-semibold'>******************</p>
                  </div>
                </ContainerWithArrow>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-[#707072]'>
                      Enable 2-step verification
                    </p>
                    <p className='font-semibold'>
                      Add additional security to you account
                    </p>
                  </div>
                </ContainerWithArrow>
                <ContainerWithArrow>
                  <div className='flex gap-1 flex-col font-heebo text-black  text-sm pb-4'>
                    <p className=' font-light text-[#707072]'>Passkeys</p>
                    <p className='font-semibold'>Set up passkey</p>
                  </div>
                </ContainerWithArrow>
                <div className='flex gap-1 justify-between font-heebo text-black text-sm pb-4'>
                  <p className='font-semibold'>Notification</p>
                  <Switch color='primary' />
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
        withoutBottomBorder && "border-b-0"
      )}
    >
      {children}
      <AshForwardIcon />
    </div>
  );
};
