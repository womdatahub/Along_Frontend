"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  LoadingSpinner,
  Separator,
} from "@/components/";
import { useAdmin } from "@/store";
import {
  Mail,
  Phone,
  Calendar,
  BadgeCheck,
  Clock,
  FileText,
  User,
} from "lucide-react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";

type Props = {
  trigger: React.ReactNode;
};

const formatDate = (raw?: string): string => {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const RiderInformationModal = ({ trigger }: Props) => {
  const { isLoading, rider } = useAdmin(
    useShallow((state) => ({
      isLoading: state.isLoading,
      rider: state.singleRiderDetails,
    })),
  );

  // Derive licence status from the new boolean + URI presence.
  const hasLicense = Boolean(rider?.licenseFrontImageUri);
  const licenseStatus = !hasLicense
    ? null
    : rider?.isLicenseApproved
      ? "Approved"
      : "Under review";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {isLoading ? (
        <DialogContent
          dialogTitle="Loading"
          className="max-w-sm md:max-w-lg min-h-[50vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden flex justify-center items-center"
        >
          <LoadingSpinner />
        </DialogContent>
      ) : (
        <DialogContent
          dialogTitle="Rider details"
          className="max-w-sm md:max-w-lg px-4 py-8"
        >
          {/* Hero */}
          <div className="flex items-start gap-3 mb-4">
            {rider?.profilePictureUri ? (
              <Image
                src={rider.profilePictureUri}
                alt={rider?.firstName ?? "Rider profile picture"}
                className="rounded-full size-24 object-cover"
                width={96}
                height={96}
              />
            ) : (
              <div className="rounded-full size-24 bg-primary/10 flex items-center justify-center">
                <User size={36} className="text-primary" />
              </div>
            )}

            <div className="flex w-full flex-col gap-3">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold truncate">
                  {rider?.firstName} {rider?.lastName}
                </h2>
                <p className="text-xs text-gray-500 capitalize">
                  {rider?.role ?? "rider"}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                {rider?.email ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Mail size={13} className="text-primary shrink-0" />
                    <span className="truncate">{rider.email}</span>
                  </span>
                ) : null}
                {rider?.mobileNumber ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Phone size={13} className="text-primary shrink-0" />
                    <span>{rider.mobileNumber}</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Profile facts */}
          <p className="text-sm font-bold mb-3">Profile</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Fact
              icon={<Calendar size={13} className="text-primary" />}
              label="Date of birth"
              value={formatDate(rider?.dateOfBirth)}
            />
            <Fact
              icon={<User size={13} className="text-primary" />}
              label="Gender"
              value={
                rider?.gender
                  ? rider.gender[0].toUpperCase() + rider.gender.slice(1)
                  : "—"
              }
            />
            <Fact
              icon={<Clock size={13} className="text-primary" />}
              label="Member since"
              value={formatDate(rider?.createdAt)}
            />
            <Fact
              icon={<BadgeCheck size={13} className="text-primary" />}
              label="Referral code"
              value={rider?.referralCode ?? "—"}
            />
          </div>

          {/* Licence */}
          <Separator className="mb-4" />
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">Driving Licence</p>
            {licenseStatus ? (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  rider?.isLicenseApproved
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {licenseStatus}
              </span>
            ) : null}
          </div>

          {hasLicense ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Fact
                icon={<FileText size={13} className="text-primary" />}
                label="Number"
                value={rider?.licenseNumber ?? "—"}
              />
              <Fact
                icon={<Calendar size={13} className="text-primary" />}
                label="Expiry"
                value={formatDate(rider?.licenseExpiryDate)}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No driving licence submitted yet.
            </p>
          )}

          {hasLicense ? (
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { label: "Front", url: rider?.licenseFrontImageUri },
                  { label: "Back", url: rider?.licenseBackImageUri },
                  { label: "Selfie", url: rider?.licenseSelfieImageUri },
                ] as { label: string; url?: string }[]
              ).map(({ label, url }) => (
                <div
                  key={label}
                  className="rounded-lg border border-gray-100 overflow-hidden bg-gray-50"
                >
                  <p className="text-[10px] font-semibold text-gray-500 px-2 py-1 border-b border-gray-100">
                    {label}
                  </p>
                  {url ? (
                    <Image
                      src={url}
                      alt={label}
                      width={400}
                      height={240}
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="h-24 flex items-center justify-center text-gray-300">
                      <FileText size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </DialogContent>
      )}
    </Dialog>
  );
};

const Fact = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2">
    <div className="mt-0.5">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  </div>
);

export { RiderInformationModal };
