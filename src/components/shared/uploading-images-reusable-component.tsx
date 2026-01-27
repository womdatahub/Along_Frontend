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
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);

    setPreviews((prev) =>
      prev.map((item, id) =>
        id === index
          ? {
              image: {
                imageFile: file, // Store the actual File object
                imageName: file.name,
                imageSize: file.size,
              },
              uri: objectUrl, // Store the object URL for preview
            }
          : item,
      ),
    );

    toast.success("Success", {
      description: `${imageToastDescription} chosen successfully`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/svg+xml": [],
    },
  });

  return (
    <div
      className={cn(
        "size-full overflow-hidden relative h-full w-fit",
        className,
      )}
    >
      {previews[index]?.uri ? (
        <Image
          src={previews[index].uri ?? ""}
          alt='image'
          width={100}
          height={100}
          className='size-full hover:cursor-pointer object-contain'
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
              isDragActive && "opacity-60",
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
