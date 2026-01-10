"use client";
import { useCallback } from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/lib";
import { ImageType } from "@/types";

type Props = {
  children: React.ReactNode;
  index: number;
  previews: ({ image: ImageType; uri: string } | null)[];
  setPreviews: React.Dispatch<
    React.SetStateAction<({ image: ImageType; uri: string } | null)[]>
  >;
  className?: string;
  imageToastDescription: string;
  // uploadToBucketFunction?:(image: ImageType) => void
};
export const UploadingImagesReusableComponent = ({
  children,
  className,
  index,
  previews,
  setPreviews,
  imageToastDescription,
}: Props) => {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = new FileReader();
    file.onload = function () {
      setPreviews((prev) =>
        prev.map((item, id) =>
          id === index
            ? {
                image: {
                  imageFile: file.result,
                  imageName: acceptedFiles[0].name,
                  imageSize: acceptedFiles[0].size,
                },
                uri: "",
              }
            : item
        )
      );
    };
    file.readAsDataURL(acceptedFiles[0]);
    toast.success("Success", {
      description: `${imageToastDescription} chosen successfully`,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 3145728,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/svg+xml": [],
    },
    // noClick: !!fileName,
  });

  return (
    <div
      className={cn(
        "size-full overflow-hidden relative h-full w-fit",
        className
      )}
    >
      {previews[index]?.image.imageFile ? (
        <Image
          src={(previews[index].image.imageFile as string) ?? ""}
          alt='image'
          width={100}
          height={100}
          className='size-full hover:cursor-pointer object-cover'
        />
      ) : (
        <div className='size-full flex flex-col gap-1 justify-center items-center text-center'>
          {children}
        </div>
      )}
      <div className='absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-white bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-opacity-50'>
        <div className='flex w-full h-full justify-center items-center'>
          <div
            className={cn(
              "flex-1 cursor-pointer bg-transparent rounded-lg p-4",
              isDragActive && "opacity-60"
            )}
          >
            <div
              {...getRootProps()}
              className=' size-full flex justify-center items-center'
            >
              <input {...getInputProps()} />

              {isDragActive ? (
                <p className='text-sm'>Drop the file here</p>
              ) : (
                <div className='size-full flex flex-col gap-1 justify-center items-center text-center'>
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
