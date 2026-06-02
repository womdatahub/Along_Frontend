"use client";

import { useSession } from "@/store";
import type { RiderProfile } from "@/types";
import { useShallow } from "zustand/shallow";
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  User,
  BadgeCheck,
  Pencil,
  Check,
  X,
  Loader2,
  CreditCard,
  ChevronRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const {
    currentUser,
    actions: { updateRiderDetails },
  } = useSession(
    useShallow((state) => ({
      currentUser: state.currentUser,
      actions: state.actions,
    })),
  );
  const riderProfile = currentUser as RiderProfile | undefined;

  const activeProfile = riderProfile
    ? {
        firstName: riderProfile.firstName ?? "",
        lastName: riderProfile.lastName ?? "",
        email: riderProfile.email ?? "",
        mobileNumber: riderProfile.mobileNumber ?? "",
        role: "Rider",
        createdAt: riderProfile.createdAt,
        profilePictureUri: riderProfile.profilePictureUri ?? null,
        dateOfBirth: riderProfile.dateOfBirth ?? "",
      }
    : null;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: activeProfile?.firstName ?? "",
    lastName: activeProfile?.lastName ?? "",
    mobileNumber: activeProfile?.mobileNumber ?? "",
  });

  if (!activeProfile) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-2xl font-bold font-heebo text-black">Profile</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center gap-3 text-center">
          <User size={40} className="text-gray-300" />
          <p className="text-gray-500">Profile information unavailable</p>
        </div>
      </div>
    );
  }

  const initials =
    `${activeProfile.firstName[0] ?? ""}${activeProfile.lastName[0] ?? ""}`.toUpperCase();

  const handleEdit = () => {
    setForm({
      firstName: activeProfile.firstName,
      lastName: activeProfile.lastName,
      mobileNumber: activeProfile.mobileNumber,
    });
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateRiderDetails({
        firstName: form.firstName,
        lastName: form.lastName,
        mobileNumber: form.mobileNumber,
        dateOfBirth: activeProfile.dateOfBirth,
      });
      if (success) {
        toast.success("Profile saved successfully");
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const displayedFields = [
    {
      label: "First name",
      value: isEditing ? undefined : activeProfile.firstName,
      editKey: "firstName" as const,
      icon: User,
    },
    {
      label: "Last name",
      value: isEditing ? undefined : activeProfile.lastName,
      editKey: "lastName" as const,
      icon: User,
    },
    {
      label: "Email address",
      value: activeProfile.email || "Not set",
      editKey: null,
      icon: Mail,
    },
    {
      label: "Phone number",
      value: isEditing ? undefined : activeProfile.mobileNumber || "Not set",
      editKey: "mobileNumber" as const,
      icon: Phone,
    },
    {
      label: "Role",
      value: activeProfile.role,
      editKey: null,
      icon: Shield,
    },
    {
      label: "Account created",
      value: activeProfile.createdAt
        ? new Date(activeProfile.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Unknown",
      editKey: null,
      icon: Calendar,
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-8xl">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold font-heebo text-black">Profile</p>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors"
          >
            <Pencil size={14} />
            Edit profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        {activeProfile.profilePictureUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeProfile.profilePictureUri}
            alt={`${activeProfile.firstName} ${activeProfile.lastName}`}
            className="size-16 rounded-2xl object-cover shrink-0"
          />
        ) : (
          <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl font-heebo shrink-0">
            {initials || <User size={28} />}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xl font-bold text-black font-heebo">
            {activeProfile.firstName} {activeProfile.lastName}
          </p>
          {activeProfile.email && (
            <p className="text-sm text-gray mt-0.5">{activeProfile.email}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full capitalize">
              <BadgeCheck size={12} />
              {activeProfile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-3 uppercase tracking-wide mb-3">
          Account Information
        </p>
        {displayedFields.map((field) => (
          <div
            key={field.label}
            className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-b-0"
          >
            <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <field.icon size={15} className="text-gray" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray">{field.label}</p>
              {isEditing && field.editKey ? (
                <input
                  type={field.editKey === "mobileNumber" ? "tel" : "text"}
                  value={form[field.editKey]}
                  maxLength={field.editKey === "mobileNumber" ? 17 : 50}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.editKey!]: e.target.value,
                    }))
                  }
                  className="mt-1 w-full max-w-xs text-sm font-medium text-black border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              ) : (
                <p className="text-sm font-medium text-black mt-0.5 capitalize">
                  {field.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* License verification */}
      <LicenseRow riderProfile={riderProfile} />
    </div>
  );
};

export default Page;

/*  License row  */

type RiderProfileShape = RiderProfile | undefined;

function LicenseRow({ riderProfile }: { riderProfile: RiderProfileShape }) {
  const hasLicense = !!(
    riderProfile?.licenseFrontImageUri || riderProfile?.licenseNumber
  );
  const isLicenseApproved = Boolean(riderProfile?.isLicenseApproved);
  const badge = !hasLicense ? null : isLicenseApproved ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
      <BadgeCheck size={11} />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
      <Clock size={11} />
      Pending
    </span>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <p className="text-sm font-semibold text-gray-3 uppercase tracking-wide mb-3">
        Verification
      </p>
      <Link
        href="/rider/license"
        className="flex items-center gap-4 py-2 group"
      >
        <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
          <CreditCard size={15} className="text-gray" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray">Driver&apos;s license</p>
          <p className="text-sm font-medium text-black mt-0.5">
            {hasLicense
              ? (riderProfile?.licenseNumber ?? "On file")
              : "Not submitted"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {badge}
          <ChevronRight
            size={16}
            className="text-gray-300 group-hover:text-gray transition-colors"
          />
        </div>
      </Link>
    </div>
  );
}
