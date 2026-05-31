"use client";

import {
  AddInput,
  AuthBackAndContinueButton,
  SelectDropdown,
} from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/uploading-images-reusable-component";
import {
  TVehicleRegistrationSchemaValidator,
  vehicleRegistrationSchema,
  ROLE_DASHBOARD_MAP,
} from "@/lib";
import { useSession } from "@/store";
import { ImageType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadImageIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { Car, Camera } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >([null, null, null, null]);
  const [vehicleClass, setVehicleClass] = useState("economy");
  const [rentalModes, setRentalModes] = useState<
    Array<"SELF_DRIVE" | "WITH_DRIVER">
  >(["WITH_DRIVER"]);

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
    control,
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
  const vehicleMake = useWatch({ control, name: "vehicleMake" });
  const vehicleModel = useWatch({ control, name: "vehicleModel" });

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
        vehicleClass,
        rentalModes,
        vehicleFrontViewImageUri: uris[0],
        vehicleBackViewImageUri: uris[1],
        vehicleSideViewImageUri: uris[2],
        insuranceDocumentUri: uris[3],
      });

      if (!isSuccess) return;
      toast.success("Vehicle information saved successfully!", {
        duration: 4000,
        position: "top-center",
      });
      setTimeout(() => {
        const url =
          registeredDriverResponseWithStripeDetails?.stripeAccount
            .accountLink ?? "";

        if (!url) {
          router.replace(ROLE_DASHBOARD_MAP.driver);
          return;
        }

        if (typeof window !== "undefined" && url) {
          window.location.assign(url);
        }
      }, 3000);
    } catch {
      toast.error("Image uploads failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Vehicle registration
          </h1>
          <p className="text-gray text-sm font-light">
            Register your vehicle to complete driver setup
          </p>
        </div>

        <div className="bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm flex flex-col gap-6">
          {/* Step badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-2 w-fit">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-gray-4">Step 4 of 4</span>
          </div>

          {/* Vehicle details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <Car size={14} className="text-gray" />
              <p className="font-semibold text-sm text-black">
                Vehicle details
              </p>
            </div>

            <SelectDropdown
              options={Object.keys(CAR_MAKES)}
              selected={vehicleMake}
              setSelected={(value: string) => {
                setValue("vehicleMake", value);
                setValue("vehicleModel", "");
              }}
              triggerLabel="Select make"
              label="Make"
              errorMessage={errors.vehicleMake?.message ?? ""}
            />

            <SelectDropdown
              options={CAR_MAKES[vehicleMake] ?? []}
              selected={vehicleModel}
              setSelected={(value: string) => setValue("vehicleModel", value)}
              triggerLabel="Select model"
              label="Model"
              disabled={!vehicleMake}
              errorMessage={errors.vehicleModel?.message ?? ""}
            />

            <div className="grid grid-cols-2 gap-3">
              <AddInput
                label="Color"
                placeholder="e.g. White"
                id="vehicleColor"
                errors={errors}
                register={register}
                disabled={false}
                required
                type="text"
                maxLength={30}
                iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
              <AddInput
                label="Year"
                placeholder="2025"
                id="vehicleYear"
                errors={errors}
                register={register}
                disabled={false}
                required
                type="tel"
                maxLength={4}
                iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
            </div>

            <AddInput
              label="VIN (Vehicle ID number)"
              placeholder="1HGCM82633A004352"
              id="vehicleIdentificationNumber"
              errors={errors}
              register={register}
              disabled={false}
              required
              type="text"
              maxLength={17}
              iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
              inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
            />

            <SelectDropdown
              options={["economy", "standard", "premium"]}
              selected={vehicleClass}
              setSelected={setVehicleClass}
              triggerLabel="economy"
              label="Vehicle class"
            />
          </div>

          {/* Rental modes */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm text-black">Rental modes</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "With driver", value: "WITH_DRIVER" as const },
                { label: "Self-drive", value: "SELF_DRIVE" as const },
              ].map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => {
                    setRentalModes((current) =>
                      current.includes(mode.value)
                        ? current.filter((item) => item !== mode.value)
                        : [...current, mode.value],
                    );
                  }}
                  className={`rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    rentalModes.includes(mode.value)
                      ? "border-2 border-primary bg-primary/5 text-primary"
                      : "border-2 border-transparent text-gray-4 hover:border-gray-2"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Car photos */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-gray" />
              <p className="font-semibold text-sm text-black">Car photos</p>
            </div>
            <p className="text-xs text-gray font-light -mt-1">
              Clear photos of front, interior, and rear help verify your vehicle
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 0, label: "Front" },
                { key: 1, label: "Interior" },
                { key: 2, label: "Rear" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <p className="text-xs text-gray font-light ml-1">{label}</p>
                  <UploadingImagesReusableComponent
                    key={key}
                    index={key}
                    previews={previews}
                    setPreviews={setPreviews}
                    className="justify-center items-center rounded-2xl bg-white text-placeholder w-full h-20 border-2 border-dashed border-gray-2 hover:border-primary transition-colors duration-200"
                    imageToastDescription={`${label} view`}
                  >
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <UploadImageIcon />
                      <p className="text-xs font-medium text-gray">{label}</p>
                    </div>
                  </UploadingImagesReusableComponent>
                </div>
              ))}
            </div>
          </div>

          {/* Registration doc */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm text-black">Car registration</p>
            <UploadingImagesReusableComponent
              key={3}
              index={3}
              previews={previews}
              setPreviews={setPreviews}
              className="justify-center items-center rounded-2xl bg-white text-placeholder w-full h-24 border-2 border-dashed border-gray-2 hover:border-primary transition-colors duration-200"
              imageToastDescription="Car registration document"
            >
              <div className="flex flex-col gap-1.5 justify-center items-center">
                <UploadImageIcon />
                <p className="text-sm font-medium text-gray">Upload document</p>
              </div>
            </UploadingImagesReusableComponent>
          </div>

          <AuthBackAndContinueButton
            backActive={!isLoading}
            continueActive={!isLoading && rentalModes.length > 0}
            continueFnc={handleSubmit(onSubmit)}
            continueIsLoading={isLoading}
          />
        </div>
      </div>
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
