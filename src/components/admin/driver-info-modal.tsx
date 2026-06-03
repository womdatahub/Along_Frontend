import {
  Dialog,
  DialogContent,
  DialogTrigger,
  LoadingSpinner,
  Separator,
  ProfileAvatar,
} from "@/components/";
import { useAdmin } from "@/store";
import { Car, Check, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";

type Props = {
  trigger: React.ReactNode;
  phoneNumber?: string;
};
const DriverInformationModal = ({ trigger, phoneNumber }: Props) => {
  const { isLoading, driver } = useAdmin(
    useShallow((state) => ({
      isLoading: state.isLoading,
      driver: state.singleDriverDetails,
    })),
  );
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {isLoading ? (
        <DialogContent
          dialogTitle="Loading"
          className="max-w-sm md:max-w-210 min-h-[50vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden flex justify-center items-center"
        >
          <LoadingSpinner />
        </DialogContent>
      ) : (
        <DialogContent
          dialogTitle="Driver details"
          className="max-w-sm md:max-w-lg px-4 py-8"
        >
          <div className="flex items-start gap-3 mb-4">
            <ProfileAvatar
              src={driver?.driverProfilePictureUri}
              firstName={driver?.firstName}
              lastName={driver?.lastName}
              size={112}
              className="size-28"
            />
            <div className="flex w-full flex-col gap-5">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold truncate">
                  {driver?.firstName} {driver?.lastName}
                </h2>
                {driver?.address ? (
                  <p className="text-sm font-semibold mt-0.5 truncate">
                    {driver.address}
                  </p>
                ) : null}
              </div>

              <div className="flex gap-3 mt-1">
                <div className="text-xl flex gap-3 items-center justify-center font-bold bg-primary text-white p-3 rounded-[5px]">
                  {driver?.rating?.totalRating ?? 0}
                  <Star size={18} className="fill-white text-white" />
                </div>

                <div className="font-semibold">
                  <span className="text-xs ">Rating</span>
                  <div>
                    <div className="flex gap-1 md:gap-3 items-center">
                      <span className="text-xs truncate">
                        {driver?.rating?.numberOfRatings ?? 0} Reviews
                      </span>
                      <div className="flex gap-0.5 items-center">
                        {Array(driver?.rating?.totalRating ?? 0)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className="fill-icons text-icons"
                            />
                          ))}
                        {Array(
                          Math.max(0, 5 - (driver?.rating?.totalRating ?? 0)),
                        )
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className="fill-gray-200 text-icons"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <span className="flex items-center gap-2 text-sm font-semibold">
                <Phone size={15} className="fill-primary text-primary" />{" "}
                {driver?.mobileNumber ?? phoneNumber}
              </span>
              <div className="flex gap-2 items-center">
                <span className="flex gap-2 text-xs text-gray-500">
                  <Car size={18} className="fill-primary text-white" />
                  <div>
                    <p className="font-bold text-sm">0</p>
                    <p className="text-xs">Completed rides</p>
                  </div>
                </span>
                <Separator
                  orientation="vertical"
                  className="h-4 w-2 bg-[#CDD4D4]"
                />

                <span className="flex gap-2 text-xs text-gray-500">
                  <MapPin size={18} className="fill-primary text-white" />
                  <div>
                    <p className="font-bold text-sm">0ml</p>
                    <p className="text-xs">Distance shared</p>
                  </div>
                </span>
              </div>
            </div>
          </div>

          <Separator className="mb-4" />
          {(() => {
            const activeVehicle =
              driver?.vehicles?.find((v) => v.isActive) ??
              driver?.vehicles?.[0];
            if (!activeVehicle) {
              return (
                <p className="text-sm text-gray-500 italic">
                  No vehicle registered yet.
                </p>
              );
            }
            return (
              <>
                <p className="text-base font-bold mb-">Registered Vehicle</p>
                <div className="flex gap-8">
                  {activeVehicle.vehicleFrontViewImageUri ? (
                    <Image
                      src={activeVehicle.vehicleFrontViewImageUri}
                      alt="Vehicle front view"
                      className="size-32 bg-gray-200 rounded-lg object-cover"
                      width={120}
                      height={120}
                    />
                  ) : (
                    <div className="size-32 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Car size={32} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-xs text-icon">Car model</p>
                      <p className="text-sm font-bold capitalize">
                        {activeVehicle.vehicleMake} {activeVehicle.vehicleModel}
                        {activeVehicle.vehicleYear
                          ? ` - ${activeVehicle.vehicleYear}`
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-icon">VIN</p>
                      <p className="text-sm font-bold">
                        {activeVehicle.vehicleIdentificationNumber ?? "—"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {driver?.rideProfile?.allowPets && (
                        <div className="flex gap-1 items-center">
                          <div className="size-3 bg-primary">
                            <Check
                              size={10}
                              className="text-white fill-white"
                            />
                          </div>
                          <span className="text-xs font-semibold">
                            Allow pets
                          </span>
                        </div>
                      )}
                      {driver?.rideProfile?.luggageCapacity ? (
                        <div className="flex gap-1 items-center">
                          <div className="size-3 bg-primary">
                            <Check
                              size={10}
                              className="text-white fill-white"
                            />
                          </div>{" "}
                          <span className="text-xs font-semibold">
                            {driver.rideProfile.luggageCapacity}Kg load
                          </span>
                        </div>
                      ) : null}
                      <div className="flex gap-1 items-center">
                        <div className="size-3 bg-primary">
                          <Check size={10} className="text-white fill-white" />
                        </div>
                        <span className="text-xs font-semibold">
                          Air condition
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="size-3 bg-primary">
                          <Check size={10} className="text-white fill-white" />
                        </div>{" "}
                        <span className="text-xs font-semibold">
                          Passenger/rear bag
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      )}
    </Dialog>
  );
};
export { DriverInformationModal };
