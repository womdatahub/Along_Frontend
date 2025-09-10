"use client";

import { Button } from "@/components";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col gap-4 w-[500px] aspect-square overflow-y-scroll text-black font-fustat'>
      <p className='font-bold text-xl text-center sticky top-0 bg-white pb-2'>
        Terms and Conditions
      </p>
      <div className='flex flex-col gap-3 text-sm text-justify'>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry-s standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <p className='font-bold text-lg'>Offered Services </p>
        <p>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using Content here, content here, making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for lorem ipsum will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like). Lorem
          Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry-s standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </p>
      </div>
      <div className='flex self-end'>
        <Button
          variant='link'
          className='text-black font-bold hover:cursor-pointer'
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          variant='link'
          className='text-primary font-bold hover:cursor-pointer'
          onClick={() => router.push("/onboarding/services")}
        >
          Accept
        </Button>
      </div>
    </div>
  );
};
export default Page;
