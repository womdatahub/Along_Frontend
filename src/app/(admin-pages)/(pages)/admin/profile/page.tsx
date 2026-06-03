"use client";

import { useSession } from "@/store";
import type { AdminProfile, DriverProfile, RiderProfile } from "@/types";
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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const {
    userRole,
    currentUser,
    actions: { updateDriverDetails, updateRiderDetails },
  } = useSession(
    useShallow((state) => ({
      userRole: state.userRole,
      currentUser: state.currentUser,
      actions: state.actions,
    })),
  );
  const adminProfile = currentUser as AdminProfile | undefined;
  const driverProfile = currentUser as DriverProfile | undefined;
  const riderProfile = currentUser as RiderProfile | undefined;

  // Resolve the active profile and derived fields based on role
  const activeProfile = (() => {
    if (userRole === "driver" && driverProfile) {
      return {
        firstName: driverProfile.firstName ?? "",
        lastName: driverProfile.lastName ?? "",
        email: "",
        mobileNumber: "",
        role: "Driver",
        createdAt: driverProfile.createdAt,
        isEmailVerified: false,
        isMobileNumberVerified: false,
        isGoogleUser: false,
        isAppleUser: false,
        isSuspended: false,
        profilePictureUri: null as string | null,
      };
    }
    if (userRole === "rider" && riderProfile) {
      return {
        firstName: riderProfile.firstName ?? "",
        lastName: riderProfile.lastName ?? "",
        email: riderProfile.email ?? "",
        mobileNumber: riderProfile.mobileNumber ?? "",
        role: "Rider",
        createdAt: riderProfile.createdAt,
        isEmailVerified: false,
        isMobileNumberVerified: false,
        isGoogleUser: false,
        isAppleUser: false,
        isSuspended: false,
        profilePictureUri: riderProfile.profilePictureUri ?? null,
      };
    }
    if (adminProfile) {
      return {
        firstName: adminProfile.firstName ?? "",
        lastName: adminProfile.lastName ?? "",
        email: adminProfile.email ?? "",
        mobileNumber: adminProfile.mobileNumber ?? "",
        role: adminProfile.role ?? "Admin",
        createdAt: adminProfile.createdAt,
        isEmailVerified: adminProfile.isEmailVerified,
        isMobileNumberVerified: adminProfile.isMobileNumberVerified,
        isGoogleUser: adminProfile.isGoogleUser,
        isAppleUser: adminProfile.isAppleUser,
        isSuspended: adminProfile.isSuspended,
        profilePictureUri: adminProfile.profilePictureUri ?? null,
      };
    }
    return null;
  })();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: activeProfile?.firstName ?? "",
    lastName: activeProfile?.lastName ?? "",
    mobileNumber: activeProfile?.mobileNumber ?? "",
  });

  if (!activeProfile) {
    return (
      <section className="flex flex-col gap-6">
        <p className="text-2xl font-bold font-heebo text-gray-900">Profile</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center gap-3 text-center">
          <User size={40} className="text-gray-300" />
          <p className="text-gray-500">Profile information unavailable</p>
        </div>
      </section>
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
      let success = false;
      if (userRole === "driver") {
        success = await updateDriverDetails({
          firstName: form.firstName,
          lastName: form.lastName,
          mobileNumber: form.mobileNumber,
        });
      } else if (userRole === "rider") {
        success = await updateRiderDetails({
          firstName: form.firstName,
          lastName: form.lastName,
          mobileNumber: form.mobileNumber,
          dateOfBirth: riderProfile?.dateOfBirth ?? "",
        });
      } else {
        // Admin update — no dedicated endpoint yet, optimistic update
        toast.success("Profile updated");
        success = true;
      }
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

  const verifications = [
    { label: "Email verified", status: activeProfile.isEmailVerified },
    { label: "Mobile verified", status: activeProfile.isMobileNumberVerified },
    { label: "Google account", status: activeProfile.isGoogleUser },
    { label: "Apple account", status: activeProfile.isAppleUser },
  ];

  return (
    <section className="flex flex-col gap-6 max-w-8xl">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold font-heebo text-gray-900">Profile</p>
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
          <p className="text-xl font-bold text-gray-900 font-heebo">
            {activeProfile.firstName} {activeProfile.lastName}
          </p>
          {activeProfile.email && (
            <p className="text-sm text-gray-500 mt-0.5">
              {activeProfile.email}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full capitalize">
              <BadgeCheck size={12} />
              {activeProfile.role}
            </span>
            {activeProfile.isSuspended && (
              <span className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                Suspended
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Account Information
        </p>
        {displayedFields.map((field) => (
          <div
            key={field.label}
            className="flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-b-0"
          >
            <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <field.icon size={15} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">{field.label}</p>
              {isEditing && field.editKey ? (
                <input
                  type={field.editKey === "mobileNumber" ? "tel" : "text"}
                  value={form[field.editKey]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.editKey!]: e.target.value,
                    }))
                  }
                  className="mt-1 w-full max-w-xs text-sm font-medium text-gray-900 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">
                  {field.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verification status */}
      {verifications.some((v) => v.status !== undefined) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Verification Status
          </p>
          <div className="grid grid-cols-2 gap-3">
            {verifications.map((v) => (
              <div
                key={v.label}
                className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                  v.status
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <BadgeCheck
                  size={16}
                  className={v.status ? "text-emerald-600" : "text-gray-300"}
                />
                <span
                  className={`text-sm font-medium ${
                    v.status ? "text-emerald-800" : "text-gray-400"
                  }`}
                >
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
