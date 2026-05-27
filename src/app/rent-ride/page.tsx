"use client";
import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogTrigger,
  HeadingHeebo,
  SelectDropdown,
  Switch,
  LoadingComponent,
} from "@/components";
import dynamic from "next/dynamic";

import { radarReverseGeocode } from "@/components/shared/radar-map";

// Lazy-load Radar SDK (WebGL + CSS) — hidden on mobile, deferred on desktop
const RadarMap = dynamic(
  () =>
    import("@/components/shared/radar-map").then((m) => ({
      default: m.RadarMap,
    })),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
  },
);
// Radar autocomplete — used in the pick-up location form
const RadarAutocomplete = dynamic(
  () =>
    import("@/components/shared/radar-map").then((m) => ({
      default: m.RadarAutocomplete,
    })),
  {
    ssr: false,
    loading: () => <span className="text-gray-400 text-sm">Loading…</span>,
  },
);
// Stripe checkout — only shown when user triggers payment
const StripeCheckOutComponent = dynamic(
  () =>
    import("@/components/shared/StripeChechoutComponent").then((m) => ({
      default: m.StripeCheckOutComponent,
    })),
  { ssr: false },
);
import { Skeleton } from "@/components/ui/skeleton";
import { carTypes, cn, formatDateToDDMMYYYY } from "@/lib";
import { useRadarMap, useRental, useSession } from "@/store";
import { VehicleLocation } from "@/types";
import {
  FilledGreenStarIcon,
  PassengerCapacityIcon,
  PetIcons,
  Return24Icon,
  TimerIcon,
  MoreInfoIcon,
} from "@public/svgs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import {
  MapPin,
  ChevronLeft,
  CheckCircle2,
  Smartphone,
  X as XIcon,
} from "lucide-react";

const Page = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <RentRide />
    </Suspense>
  );
};

const RentRide = () => {
  const [open, setOpen] = useState(false);
  const [mobileBannerDismissed, setMobileBannerDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount (client-only)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"hours" | "days">("hours");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedHours, setSelectedHours] = useState<string>("");
  const [selectedHoursLength, setSelectedHoursLength] = useState<string>("");
  const [selectedMins, setSelectedMins] = useState<string>("");
  const [selectAmOrPm, setSelectAmOrPm] = useState<string>("am");
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [flexibility, setFlexibility] = useState<boolean>(false);
  const [proceedToCheckout, setProceedToCheckout] = useState<boolean>(false);

  const router = useRouter();
  const { riderProfile } = useSession(
    useShallow((state) => ({ riderProfile: state.riderProfile })),
  );

  const searchParams = useSearchParams();
  const vehicleType = searchParams.get("vehicleType");
  const selectedDriver = searchParams.get("selectedDriver");
  const isReview = !!searchParams.get("isReview");
  const rawIsLater = searchParams.get("isLater");
  const isLater = rawIsLater === "true";
  const queryBookingType = searchParams.get("bookingType");
  const bookingType =
    queryBookingType === "SELF_DRIVE" || queryBookingType === "WITH_DRIVER"
      ? queryBookingType
      : "WITH_DRIVER";
  const licenseApproved =
    String(riderProfile?.licenseStatus ?? "").toLowerCase() === "approved";
  const requiresLicenseReview =
    bookingType === "SELF_DRIVE" && !licenseApproved;

  const func = (selectedDriver: VehicleLocation) => {
    setSelectedDriverDetails(selectedDriver);
  };

  // Called when the user drags the pickup pin on the map.
  // Optimistically moves the coordinates, then reverse-geocodes to update the address label.
  const handlePickupDrag = async (lng: number, lat: number) => {
    if (!autoCompleteAddress) return;

    // Capture current address snapshot so the async continuation doesn't use a stale reference
    const base = autoCompleteAddress;
    const updatedCoords = {
      longitude: lng,
      latitude: lat,
      geometry: {
        type: "Point" as const,
        coordinates: [lng, lat] as [number, number],
      },
    };

    // Immediately reflect the new position so the marker stays where the user dropped it
    setAutoCompleteAddress({ ...base, ...updatedCoords });

    // Reverse-geocode in the background and replace the address label once resolved
    const result = await radarReverseGeocode(lat, lng);
    if (!result) return;

    setAutoCompleteAddress({
      ...base,
      ...updatedCoords,
      formattedAddress: result.formattedAddress,
      addressLabel: result.placeLabel ?? result.formattedAddress,
      city: result.city ?? base.city,
      state: result.state ?? base.state,
      country: result.country ?? base.country,
      countryCode: result.countryCode ?? base.countryCode,
      countryFlag: result.countryFlag ?? base.countryFlag,
      county: result.county ?? base.county,
    });
  };

  const {
    autoCompleteAddress,
    actions: { setAutoCompleteAddress },
  } = useRadarMap(
    useShallow((state) => ({
      actions: state.actions,
      autoCompleteAddress: state.autoCompleteAddress,
    })),
  );
  const {
    selectedDriverDetails,
    isCreatingIntent,
    intent,
    availableVehicles,
    isLoading: isLoadingRental,
    actions: {
      retrieveAvailableVehicles,
      rentAndCreateIntent,
      setSelectedDriverDetails,
    },
  } = useRental(
    useShallow((state) => ({
      actions: state.actions,
      selectedDriverDetails: state.selectedDriverDetails,
      isLoading: state.isLoading,
      isCreatingIntent: state.isCreatingIntent,
      intent: state.intent,
      availableVehicles: state.availableVehicles,
    })),
  );

  useEffect(() => {
    if (!autoCompleteAddress || !vehicleType) return;
    retrieveAvailableVehicles({
      vehicleClass: vehicleType as string,
      bookingType,
      longitude: `${autoCompleteAddress.longitude}`,
      latitude: `${autoCompleteAddress.latitude}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    vehicleType,
    bookingType,
    autoCompleteAddress?.longitude,
    autoCompleteAddress?.latitude,
  ]);

  useEffect(() => {
    if (
      (!selectedHours ||
        !selectedHoursLength ||
        !selectedMins ||
        !selectAmOrPm) &&
      vehicleType
    ) {
      router.push(
        `?vehicleType=${vehicleType}&isLater=${isLater}${selectedDriver ? `&selectedDriver=${selectedDriver}` : ""}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHours, selectedHoursLength, selectedMins, selectAmOrPm, isLater]);

  const getPickupWindow = () => {
    const duration = Number(selectedHoursLength.split(" ")[0]);
    const durationHours = selectedTab === "hours" ? duration : duration * 24;
    const startDate = isLater && date ? new Date(date) : new Date();
    const hour = Number(selectedHours);
    const minute = Number(selectedMins);
    const isPm = selectAmOrPm.toLowerCase() === "pm";
    const normalizedHour =
      hour === 12 ? (isPm ? 12 : 0) : isPm ? hour + 12 : hour;

    startDate.setHours(normalizedHour, minute, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);

    return {
      durationHours,
      pickUpTime: startDate.toISOString(),
      requestedEndAt: endDate.toISOString(),
    };
  };

  return (
    <>
      {/* Mobile app recommendation banner */}
      {isMobile && !mobileBannerDismissed && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-2xl rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-3 md:hidden">
          {/* Drag handle */}
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-1" />
          <div className="flex items-start justify-between gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Smartphone size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">
                Better on the app
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                The full map and drag-to-adjust pin are only available in the
                Along mobile app. Download it for the best experience.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileBannerDismissed(true)}
              className="shrink-0 size-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
            >
              <XIcon size={14} />
            </button>
          </div>
          <div className="flex gap-2">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 rounded-xl bg-gray-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"
            >
              App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 rounded-xl bg-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
            >
              Google Play
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMobileBannerDismissed(true)}
            className="text-xs text-gray-400 text-center hover:text-gray-600 transition-colors"
          >
            Continue on web anyway
          </button>
        </div>
      )}

      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-7xl flex flex-row h-[calc(100vh-80px)] overflow-hidden">
          {/*  Left panel  */}
          <div className="w-full md:w-110 lg:w-104 xl:w-md shrink-0 h-full overflow-y-auto bg-background border-r border-gray-100">
            <div className="flex flex-col gap-5 p-5 pb-10">
              {/*  Step 1: Location display  */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-3 font-heebo">
                  Pick-up Location
                </p>
                {autoCompleteAddress ? (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black truncate">
                          {autoCompleteAddress.formattedAddress}
                        </p>
                        {autoCompleteAddress.county && (
                          <p className="text-xs text-gray font-light mt-0.5">
                            {autoCompleteAddress.county}
                            {autoCompleteAddress.country
                              ? `, ${autoCompleteAddress.country}`
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    {vehicleType ? (
                      <Link
                        href="/rent-ride"
                        onClick={() =>
                          useRadarMap.setState({
                            autoCompleteAddress: undefined,
                          })
                        }
                        className="shrink-0 text-xs font-semibold text-primary hover:text-primary-deep transition-colors"
                      >
                        Change
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-background rounded-xl px-4 py-3">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <div className="flex-1 text-sm text-gray-700">
                        <RadarAutocomplete
                          setAutoCompleteAddress={setAutoCompleteAddress}
                          defaultValue={undefined}
                          placeholder="Enter your pickup location"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray font-light">
                      Enter a location to see available vehicles near you.{" "}
                      <Link
                        href="/"
                        className="text-primary font-medium hover:underline"
                      >
                        Go back home
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              {/*  Step 2: Vehicle type selection (shown when address set)  */}
              {autoCompleteAddress && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray uppercase tracking-wider font-heebo">
                      Vehicle Class
                    </p>
                    {vehicleType && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {carTypes.map((car) => {
                      const slug = car.name.toLowerCase().replace(/\s+/g, "-");
                      const isActive = vehicleType === slug;
                      return (
                        <button
                          key={car.name}
                          onClick={() => {
                            router.push(
                              `/rent-ride?vehicleType=${slug}&bookingType=${bookingType}`,
                            );
                            setOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer",
                            isActive
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-background text-gray-700 border-gray-200 hover:border-primary hover:text-primary",
                          )}
                        >
                          <Image
                            src="/images/small-car.png"
                            alt={car.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                          <span>{car.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/*  Step 3: Booking mode (shown when vehicleType set)  */}
              {vehicleType && !selectedDriver && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-3 font-heebo">
                    Booking Mode
                  </p>
                  <div className="grid grid-cols-2 gap-2 bg-background p-1.5 rounded-xl">
                    {[
                      { label: "With driver", value: "WITH_DRIVER" as const },
                      { label: "Self-drive", value: "SELF_DRIVE" as const },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          router.push(
                            `/rent-ride?vehicleType=${vehicleType}&bookingType=${item.value}`,
                          );
                        }}
                        className={cn(
                          "rounded-lg py-2.5 text-sm font-semibold transition-all duration-150 cursor-pointer",
                          bookingType === item.value
                            ? "bg-white text-primary shadow-sm"
                            : "text-gray hover:text-gray-700",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/*  Step 4: Driver cards (shown when vehicleType set, no driver selected)  */}
              {vehicleType && !selectedDriver && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold text-gray uppercase tracking-wider font-heebo px-1">
                    Available Vehicles
                  </p>
                  {isLoadingRental ? (
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-28 rounded-2xl" />
                      <Skeleton className="h-28 rounded-2xl" />
                      <Skeleton className="h-28 rounded-2xl" />
                    </div>
                  ) : (availableVehicles ?? []).length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center">
                        <MapPin size={20} className="text-gray" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        No vehicles available
                      </p>
                      <p className="text-xs text-gray font-light max-w-xs">
                        There are no {vehicleType} vehicles near your location
                        right now. Try a different vehicle class.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {(availableVehicles ?? []).map((vehicle, i) => (
                        <DriverCard
                          key={i}
                          vehicle={vehicle}
                          func={func}
                          vehicleType={vehicleType}
                          isLater={isLater}
                          bookingType={bookingType}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/*  Step 5: Scheduling + review (shown when driver selected)  */}
              {vehicleType && selectedDriver && (
                <div className="flex flex-col gap-5">
                  {/* Selected vehicle summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                    {selectedDriverDetails?.vehicleInfo
                      .vehicleSideViewImageUri && (
                      <Image
                        src={
                          selectedDriverDetails.vehicleInfo
                            .vehicleSideViewImageUri
                        }
                        alt="car"
                        width={80}
                        height={80}
                        className="w-20 aspect-square object-cover rounded-xl shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black capitalize truncate">
                        {selectedDriverDetails?.vehicleInfo?.vehicleMake}{" "}
                        {selectedDriverDetails?.vehicleInfo?.vehicleModel}{" "}
                        <span className="text-gray font-normal">
                          · {selectedDriverDetails?.vehicleInfo?.vehicleYear}
                        </span>
                      </p>
                      <p className="text-xs text-gray mt-0.5 capitalize">
                        {selectedDriverDetails?.driverInfo?.firstName}{" "}
                        {selectedDriverDetails?.driverInfo?.lastName}
                      </p>
                    </div>
                    <Link
                      href={{
                        pathname: "/rent-ride",
                        query: { vehicleType, isLater, bookingType },
                      }}
                      className="text-xs font-semibold text-primary hover:text-primary-deep transition-colors shrink-0"
                    >
                      <ChevronLeft size={14} className="inline" /> Change
                    </Link>
                  </div>

                  {/* Pick-up location */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-3 font-heebo">
                      Pick-up Location
                    </p>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1 shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black">
                            {autoCompleteAddress?.formattedAddress}
                          </p>
                          <p className="text-xs text-gray font-light mt-0.5">
                            {autoCompleteAddress?.county}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="bg-background text-black hover:bg-primaryLight2 rounded-full px-4 h-8 text-xs font-semibold shrink-0"
                        asChild
                      >
                        <Link
                          href={{
                            pathname: "/rent-ride",
                            query: { vehicleType, isLater, bookingType },
                          }}
                          onClick={() =>
                            useRadarMap.setState({
                              autoCompleteAddress: undefined,
                            })
                          }
                        >
                          Change
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Duration + time pickers */}
                  {!isReview && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
                      <p className="text-xs font-semibold text-gray uppercase tracking-wider font-heebo">
                        Schedule
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Duration */}
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-semibold text-gray-700 pl-1">
                            Duration
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="rounded-xl bg-background border border-gray-200 items-center justify-between px-4 py-3 w-full flex gap-2 hover:border-primary transition-colors text-left">
                                <p
                                  className={cn(
                                    "text-xs font-medium truncate",
                                    selectedHoursLength
                                      ? "text-black"
                                      : "text-gray",
                                  )}
                                >
                                  {selectedHoursLength || "Choose duration"}
                                </p>
                                <Return24Icon />
                              </button>
                            </DialogTrigger>
                            <DialogContent
                              dialogTitle="Choose rent duration"
                              className="sm:max-w-106.25 p-0 rounded-[20px] overflow-hidden bg-background"
                              showCloseButton={false}
                            >
                              <RentRideDialogComponent
                                title="Rent duration"
                                subTitle="Choose how long to ride"
                              >
                                <div className="flex flex-col gap-2 py-9 px-4">
                                  <div className="flex gap-3">
                                    <Button
                                      className={cn(
                                        "text-primary-deep text-sm font-bold bg-transparent hover:bg-transparent w-fit h-fit p-0 underline",
                                        selectedTab !== "hours" &&
                                          "text-placeholder no-underline",
                                      )}
                                      onClick={() => setSelectedTab("hours")}
                                    >
                                      Hours
                                    </Button>
                                    <Button
                                      className={cn(
                                        "text-primary-deep text-sm font-bold bg-transparent hover:bg-transparent w-fit h-fit p-0 underline",
                                        selectedTab !== "days" &&
                                          "text-placeholder no-underline",
                                      )}
                                      onClick={() => setSelectedTab("days")}
                                    >
                                      Day
                                    </Button>
                                  </div>
                                  <SelectDropdown
                                    options={Array(
                                      selectedTab === "hours" ? 12 : 6,
                                    )
                                      .fill(0)
                                      .map((_, index) => {
                                        return `${index + 1} ${selectedTab === "hours" ? "Hour" : "Day"}${index + 1 === 1 ? "" : "s"}`;
                                      })}
                                    triggerLabel={`Select ${selectedTab === "hours" ? "hours" : "days"}`}
                                    selected={selectedHoursLength}
                                    setSelected={setSelectedHoursLength}
                                  />
                                </div>
                              </RentRideDialogComponent>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Pick-up time */}
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-semibold text-gray-700 pl-1">
                            Pick-up time
                          </p>
                          <Dialog
                            open={pickupModalOpen}
                            onOpenChange={setPickupModalOpen}
                          >
                            <DialogTrigger asChild>
                              <button className="rounded-xl bg-background border border-gray-200 items-center justify-between px-4 py-3 w-full flex gap-2 hover:border-primary transition-colors text-left">
                                <p
                                  className={cn(
                                    "text-xs font-medium truncate",
                                    selectedHours &&
                                      selectedMins &&
                                      selectAmOrPm
                                      ? "text-black"
                                      : "text-gray",
                                  )}
                                >
                                  {selectedHours && selectedMins && selectAmOrPm
                                    ? `${selectedHours}:${selectedMins} ${selectAmOrPm}`
                                    : "Choose time"}
                                </p>
                                <TimerIcon />
                              </button>
                            </DialogTrigger>
                            <DialogContent
                              dialogTitle="Choose a pick up time"
                              className="sm:max-w-106.25 p-0 rounded-[20px] overflow-hidden bg-background"
                              showCloseButton={false}
                            >
                              <RentRideDialogComponent
                                title="Pick up time"
                                subTitle="Choose the time you'd like to be picked up"
                              >
                                <div className="flex flex-col gap-2 py-9 px-4">
                                  <div className="flex p-4 gap-4">
                                    <div className="flex bg-white rounded-[10px] h-12">
                                      <div className="flex p-4 gap-2 items-center">
                                        <p className="text-sm">Hour</p>
                                        <SelectDropdown
                                          options={Array(12)
                                            .fill(0)
                                            .map((_, i) => `${i + 1}`)}
                                          triggerClassName="bg-[#F8F8F8] hover:cursor-pointer w-fit min-h-4 rounded-lg"
                                          triggerLabel="1"
                                          withoutIcon
                                          selected={selectedHours}
                                          setSelected={setSelectedHours}
                                        />
                                      </div>
                                      <div className="w-px h-4 bg-primaryLight2 self-center" />
                                      <div className="flex p-4 gap-2 items-center">
                                        <p className="text-sm">Min</p>
                                        <SelectDropdown
                                          options={Array(60)
                                            .fill(0)
                                            .map(
                                              (_, i) =>
                                                `${i <= 10 ? "0" : ""}${i + 1}`,
                                            )}
                                          triggerClassName="bg-[#F8F8F8] hover:cursor-pointer w-fit min-h-4 rounded-lg"
                                          triggerLabel="1"
                                          withoutIcon
                                          selected={selectedMins}
                                          setSelected={setSelectedMins}
                                        />
                                      </div>
                                    </div>
                                    <div className="bg-white rounded-[10px] h-12 flex items-center justify-center">
                                      <SelectDropdown
                                        options={["AM", "PM"]}
                                        triggerClassName="hover:cursor-pointer w-fit min-h-4"
                                        triggerLabel="AM"
                                        withoutIcon
                                        selected={selectAmOrPm}
                                        setSelected={setSelectAmOrPm}
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => setPickupModalOpen(false)}
                                    className="rounded-full self-center"
                                  >
                                    OK
                                  </Button>
                                </div>
                              </RentRideDialogComponent>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      {/* Date (if later) */}
                      {isLater && (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-semibold text-gray-700 pl-1">
                            Select date
                          </p>
                          <Dialog
                            open={isDateDialogOpen}
                            onOpenChange={setIsDateDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <button className="rounded-xl bg-background border border-gray-200 items-center justify-between px-4 py-3 w-full flex gap-2 hover:border-primary transition-colors text-left">
                                <p
                                  className={cn(
                                    "text-xs font-medium",
                                    date ? "text-black" : "text-gray",
                                  )}
                                >
                                  {date
                                    ? formatDateToDDMMYYYY(date as Date)
                                    : "Choose a date"}
                                </p>
                                <Return24Icon />
                              </button>
                            </DialogTrigger>
                            <DialogContent
                              dialogTitle="Choose rent date"
                              className="sm:max-w-106.25 w-fit p-0 rounded-[20px] overflow-hidden bg-background"
                              showCloseButton={false}
                            >
                              <RentRideDialogComponent
                                title={
                                  date ? formatDateToDDMMYYYY(date as Date) : ""
                                }
                                subTitle=""
                                isTitleCentered
                              >
                                <div className="flex flex-col gap-5 justify-center items-center bg-white w-fit pb-6 px-4">
                                  <Calendar
                                    mode="single"
                                    defaultMonth={date}
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={{ before: new Date() }}
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
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}

                      {/* Time flexibility */}
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">
                            Time Flexibility
                          </p>
                          <MoreInfoIcon />
                        </div>
                        <Switch
                          color="primary"
                          checked={flexibility}
                          onCheckedChange={() =>
                            setFlexibility((prev) => !prev)
                          }
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Review summary */}
                  {isReview && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
                      <p className="text-xs font-semibold text-gray uppercase tracking-wider font-heebo">
                        Booking Summary
                      </p>
                      <div className="flex flex-col gap-3">
                        {[
                          {
                            title: "Rental mode",
                            value:
                              bookingType === "SELF_DRIVE"
                                ? "Self-drive"
                                : "With driver",
                          },
                          {
                            title: "Rent Duration",
                            value: selectedHoursLength,
                          },
                          {
                            title: "Pick up time",
                            value: `${selectedHours} : ${selectedMins} ${selectAmOrPm}`,
                          },
                          {
                            title: "Time Flexibility",
                            value: flexibility ? "Yes" : "No",
                          },
                          ...(date
                            ? [
                                {
                                  title: "Rent Date",
                                  value: date
                                    ? formatDateToDDMMYYYY(date as Date)
                                    : "",
                                },
                              ]
                            : []),
                        ].map((review) => (
                          <div
                            key={review.title}
                            className="flex justify-between gap-4 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                          >
                            <p className="text-gray font-medium">
                              {review.title}
                            </p>
                            <p className="font-semibold text-black text-right">
                              {review.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* License warning */}
                  {requiresLicenseReview && (
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col gap-3 text-sm">
                      <p className="font-bold text-amber-800">
                        License review required
                      </p>
                      <p className="text-amber-700 font-light leading-relaxed">
                        Self-drive rentals require an approved license before
                        payment. You can continue with a driver, or submit your
                        license for review.
                      </p>
                      <Button
                        asChild
                        className="rounded-full w-fit bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Link href="/rider/license">Submit license</Link>
                      </Button>
                    </div>
                  )}

                  {/* CTA + Cost breakdown */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
                    {isReview && (
                      <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
                        {[
                          { title: "Base Cost", value: intent?.cost.baseCost },
                          {
                            title: "Pickup Charge",
                            value: intent?.cost.pickUpCharge,
                          },
                          { title: "Tax", value: intent?.cost.tax },
                          { title: "Total", value: intent?.cost.total },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex justify-between gap-4 text-sm",
                              item.title === "Total"
                                ? "font-bold text-base text-black pt-1 border-t border-gray-100"
                                : "font-medium text-gray",
                            )}
                          >
                            <p>{item.title}</p>
                            {isCreatingIntent ? (
                              <Skeleton className="w-12 h-4 rounded-sm" />
                            ) : (
                              <p
                                className={cn(
                                  !intent &&
                                    !isCreatingIntent &&
                                    "text-red-500 text-xs animate-pulse",
                                )}
                              >
                                {item.value ? `$${item.value}` : "Failed"}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      className="bg-primary hover:bg-primary-deep text-white rounded-xl h-12 text-sm font-semibold w-full transition-colors duration-200"
                      disabled={
                        !autoCompleteAddress ||
                        !selectedHours ||
                        !selectedMins ||
                        !selectAmOrPm ||
                        !selectedHoursLength ||
                        isCreatingIntent ||
                        requiresLicenseReview
                      }
                      onClick={async () => {
                        if (requiresLicenseReview) {
                          toast.error(
                            "An approved license is required for self-drive rentals",
                          );
                          return;
                        }
                        if (isLater && !date) {
                          toast.error("Please select a date");
                          return;
                        }
                        if (!autoCompleteAddress || !selectedDriverDetails)
                          return;
                        const { durationHours, pickUpTime, requestedEndAt } =
                          getPickupWindow();
                        if (!intent?.cost) {
                          const createdIntent = await rentAndCreateIntent({
                            bookingType,
                            flexibility,
                            days: [],
                            duration: durationHours,
                            vehicleId: selectedDriverDetails.vehicleId,
                            pickUpLat: autoCompleteAddress.latitude,
                            pickUpLong: autoCompleteAddress.longitude,
                            pickUpAddress: autoCompleteAddress.formattedAddress,
                            pickUpTime,
                            requestedEndAt,
                          });
                          if (createdIntent?.paymentIntent.paymentIntent) {
                            setProceedToCheckout(true);
                          }
                          return;
                        }
                        if (intent?.paymentIntent.paymentIntent) {
                          setProceedToCheckout(true);
                        }
                      }}
                    >
                      {isReview ? (
                        intent ? (
                          "Proceed to payment"
                        ) : isCreatingIntent ? (
                          "Loading…"
                        ) : (
                          "Retry"
                        )
                      ) : (
                        <Link
                          href={{
                            query: {
                              vehicleType,
                              selectedDriver,
                              isReview: true,
                              isLater,
                              bookingType,
                            },
                          }}
                        >
                          Review request
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*  Right panel: Map  */}
          <div className="hidden md:flex flex-1 h-full overflow-hidden">
            <RadarMap
              pickup={[
                autoCompleteAddress?.longitude ?? 0,
                autoCompleteAddress?.latitude ?? 0,
              ]}
              onPickupChange={
                autoCompleteAddress ? handlePickupDrag : undefined
              }
            />
          </div>
        </div>
      </div>
      <StripeCheckOutComponent
        open={proceedToCheckout}
        onClose={() => {
          useRental.persist.clearStorage();
          setProceedToCheckout(false);
        }}
      />
    </>
  );
};;;;

export default Page;

//  Driver card component
type DriverCardProps = {
  vehicle: VehicleLocation;
  func: (v: VehicleLocation) => void;
  vehicleType: string;
  isLater: boolean;
  bookingType: "SELF_DRIVE" | "WITH_DRIVER";
};

const DriverCard = ({
  vehicle,
  func,
  vehicleType,
  isLater,
  bookingType,
}: DriverCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4 hover:border-primary/30 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* Vehicle image */}
        <Image
          src={vehicle.vehicleInfo.vehicleSideViewImageUri}
          alt="car"
          width={72}
          height={72}
          className="w-18 aspect-square object-cover rounded-xl shrink-0"
        />
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-black capitalize truncate">
            {vehicle.vehicleInfo?.vehicleMake}{" "}
            {vehicle.vehicleInfo?.vehicleModel}
            <span className="text-gray font-normal">
              {" "}
              · {vehicle.vehicleInfo?.vehicleYear}
            </span>
          </p>
          <p className="text-xs text-gray mt-0.5 capitalize">
            {vehicle.driverInfo?.firstName} {vehicle.driverInfo?.lastName}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
              <FilledGreenStarIcon />
              <span>
                {vehicle.driverInfo?.rating?.numberOfRatings ?? 0} rating
              </span>
            </span>
            <span className="text-xs text-gray">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-700">
              <PassengerCapacityIcon />
              <span>{vehicle.capacity} seats</span>
            </span>
            <span className="text-xs text-gray">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-700">
              <PetIcons />
              <span>
                {vehicle.driverInfo.rideProfile.allowPets
                  ? "Pets OK"
                  : "No pets"}
              </span>
            </span>
          </div>
        </div>
        {/* Rate */}
        <div className="text-right shrink-0">
          <p className="text-base font-extrabold text-black">
            ${vehicle.driverInfo.rideProfile?.ratePerHour ?? 0}
          </p>
          <p className="text-xs text-gray font-light">/hr</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <Button
          onClick={() => func(vehicle)}
          variant="default"
          className="flex-1 bg-primary hover:bg-primary-deep text-white rounded-xl h-9 text-xs font-semibold transition-colors cursor-pointer"
          asChild
        >
          <Link
            href={{
              query: {
                selectedDriver: vehicle.vehicleId,
                vehicleType,
                isLater,
                bookingType,
              },
            }}
          >
            Book
          </Link>
        </Button>
        <Button
          onClick={() => func(vehicle)}
          variant="secondary"
          className="flex-1 rounded-xl h-9 text-xs font-semibold bg-background hover:bg-primaryLight2 text-gray-700 border-0 cursor-pointer"
          asChild
        >
          <Link
            href={{
              pathname: "/rent-ride/vehicle-details",
              query: {
                selectedDriver: vehicle.vehicleId,
                vehicleType,
                isLater,
                bookingType,
              },
            }}
          >
            View details
          </Link>
        </Button>
      </div>
    </div>
  );
};

//  Dialog wrapper
type RentRideDialogComponentProps = {
  title: string;
  subTitle: string;
  children: React.ReactNode;
  isTitleCentered?: boolean;
};
export const RentRideDialogComponent = ({
  title,
  subTitle,
  children,
  isTitleCentered,
}: RentRideDialogComponentProps) => {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex flex-col bg-primaryLight2 p-4">
        <HeadingHeebo
          className={cn(
            "text-left font-semibold text-xl text-primary-deep",
            isTitleCentered && "text-center",
          )}
        >
          {title}
        </HeadingHeebo>
        <p className="text-[10px]">{subTitle}</p>
      </div>
      {children}
    </div>
  );
};
