"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Shield,
  Moon,
  Globe,
  Smartphone,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { useSession } from "@/store";
import { useShallow } from "zustand/shallow";
import { requests } from "@/lib";
import { toast } from "sonner";
import { TwoFactorFlow, PasswordInput } from "@/components";

type ToggleProps = {
  enabled: boolean;
  onChange: (v: boolean) => void;
};

const Toggle = ({ enabled, onChange }: ToggleProps) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
      enabled ? "bg-primary" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Page = () => {
  const { userRole } = useSession(
    useShallow((s) => ({ userRole: s.userRole })),
  );
  const isAdmin =
    !userRole || userRole === "admin" || userRole === "SUPER_ADMIN";

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    sosAlerts: true,
    newDrivers: false,
    newRiders: false,
    systemUpdates: true,
    pushNotifications: false,
    smsAlerts: false,
    weeklyReport: true,
  });

  const [appearance, setAppearance] = useState(() => ({
    darkMode:
      typeof window !== "undefined" &&
      localStorage.getItem("along-dark-mode") === "true",
    compactView: false,
  }));

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    loginAlerts: true,
  });

  // Sync DOM class with dark mode state
  useEffect(() => {
    document.documentElement.classList.toggle("dark", appearance.darkMode);
  }, [appearance.darkMode]);

  const toggle = <K extends keyof typeof notifications>(key: K) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleAppearance = <K extends keyof typeof appearance>(
    key: K,
    value?: boolean,
  ) => {
    const next = value !== undefined ? value : !appearance[key];
    setAppearance((prev) => ({ ...prev, [key]: next }));

    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("along-dark-mode", String(next));
    }
  };

  const toggleSecurity = <K extends keyof typeof security>(key: K) =>
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }));

  // 2FA flow state
  const [twoFaMode, setTwoFaMode] = useState<"enable" | "disable" | null>(null);

  // Change-password state
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwForm.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setPwSaving(true);
    try {
      const { error } = await requests.user.changePassword({
        oldPassword: pwForm.current,
        newPassword: pwForm.next,
      });
      if (error) {
        toast.error("Password change failed. Check your current password.");
        return;
      }
      toast.success("Password changed successfully");
      setChangePwOpen(false);
      setPwForm({ current: "", next: "", confirm: "" });
    } finally {
      setPwSaving(false);
    }
  };

  // Notification items — admin-only items are flagged
  const notificationItems = [
    {
      key: "emailAlerts" as const,
      label: "Email alerts",
      description: "Receive alerts via email",
      icon: Mail,
      adminOnly: false,
    },
    {
      key: "sosAlerts" as const,
      label: "SOS alerts",
      description: "Get notified immediately for SOS events",
      icon: Shield,
      adminOnly: true,
    },
    {
      key: "newDrivers" as const,
      label: "New driver registrations",
      description: "Alert when new drivers sign up",
      icon: Bell,
      adminOnly: true,
    },
    {
      key: "newRiders" as const,
      label: "New rider registrations",
      description: "Alert when new riders sign up",
      icon: Bell,
      adminOnly: true,
    },
    {
      key: "systemUpdates" as const,
      label: "System updates",
      description: "Platform maintenance and updates",
      icon: Globe,
      adminOnly: false,
    },
    {
      key: "pushNotifications" as const,
      label: "Push notifications",
      description: "Browser push notifications",
      icon: Bell,
      adminOnly: false,
    },
    {
      key: "smsAlerts" as const,
      label: "SMS alerts",
      description: "Critical alerts via SMS",
      icon: MessageSquare,
      adminOnly: false,
    },
    {
      key: "weeklyReport" as const,
      label: "Weekly report",
      description: "Summary report every Monday",
      icon: Mail,
      adminOnly: true,
    },
  ].filter((item) => isAdmin || !item.adminOnly);

  return (
    <section className="flex flex-col gap-6 max-w-8xl">
      <p className="text-2xl font-bold font-heebo text-gray-900">Settings</p>

      {/* Notification settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-xl bg-violet-50 flex items-center justify-center">
            <Bell size={15} className="text-violet-600" />
          </div>
          <p className="font-semibold text-gray-900">Notifications</p>
        </div>

        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <item.icon size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
            <Toggle
              enabled={notifications[item.key]}
              onChange={() => toggle(item.key)}
            />
          </div>
        ))}
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Moon size={15} className="text-amber-600" />
          </div>
          <p className="font-semibold text-gray-900">Appearance</p>
        </div>

        {(
          [
            {
              key: "darkMode" as const,
              label: "Dark mode",
              description: "Use dark theme across the dashboard",
              icon: Moon,
            },
            {
              key: "compactView" as const,
              label: "Compact view",
              description: "Reduce padding and spacing for dense content",
              icon: Smartphone,
            },
          ] as const
        ).map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <item.icon size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
            <Toggle
              enabled={appearance[item.key]}
              onChange={(v) => toggleAppearance(item.key, v)}
            />
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Shield size={15} className="text-emerald-600" />
          </div>
          <p className="font-semibold text-gray-900">Security</p>
        </div>

        {/* 2FA row */}
        <div className="border-b border-gray-50">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Shield size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Two-factor authentication
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Require 2FA on every login
                </p>
              </div>
            </div>
            <Toggle
              enabled={security.twoFactor}
              onChange={() => {
                if (twoFaMode) return;
                setTwoFaMode(security.twoFactor ? "disable" : "enable");
              }}
            />
          </div>
          {twoFaMode && (
            <TwoFactorFlow
              mode={twoFaMode}
              onSuccess={() => {
                setSecurity((prev) => ({
                  ...prev,
                  twoFactor: twoFaMode === "enable",
                }));
                setTwoFaMode(null);
              }}
              onCancel={() => setTwoFaMode(null)}
            />
          )}
        </div>

        {/* Non-2FA security rows */}
        {[
          {
            key: "sessionTimeout" as const,
            label: "Auto session timeout",
            description: "Sign out after 30 minutes of inactivity",
            icon: Moon,
          },
          {
            key: "loginAlerts" as const,
            label: "Login alerts",
            description: "Email notification on new sign-in",
            icon: Mail,
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <item.icon size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
            <Toggle
              enabled={security[item.key]}
              onChange={() => toggleSecurity(item.key)}
            />
          </div>
        ))}
      </div>

      {/* Account actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Account Actions
        </p>

        {/* Change password */}
        <div className="border-b border-gray-50">
          <button
            onClick={() => setChangePwOpen((o) => !o)}
            className="flex items-center justify-between py-3.5 w-full text-left group hover:bg-gray-50 -mx-1 px-1 rounded-xl transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                Change password
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Update your account password
              </p>
            </div>
            {changePwOpen ? (
              <X
                size={16}
                className="text-gray-300 group-hover:text-gray-400 transition-colors"
              />
            ) : (
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-gray-400 transition-colors"
              />
            )}
          </button>

          {changePwOpen && (
            <div className="pb-4 flex flex-col gap-3">
              {(
                [
                  {
                    key: "current" as const,
                    label: "Current password",
                    placeholder: "Enter current password",
                  },
                  {
                    key: "next" as const,
                    label: "New password",
                    placeholder: "Enter new password (min 8 chars)",
                  },
                  {
                    key: "confirm" as const,
                    label: "Confirm new password",
                    placeholder: "Repeat new password",
                  },
                ] as const
              ).map(({ key, label, placeholder }) => (
                <label
                  key={key}
                  className="flex flex-col gap-1 text-xs font-medium text-gray-600"
                >
                  {label}
                  <PasswordInput
                    value={pwForm[key]}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setPwForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </label>
              ))}
              <button
                onClick={handleChangePassword}
                disabled={pwSaving}
                className="self-start flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-60 px-5 py-2 rounded-xl transition-colors mt-1"
              >
                {pwSaving && <Loader2 size={13} className="animate-spin" />}
                {pwSaving ? "Saving…" : "Update password"}
              </button>
            </div>
          )}
        </div>

        {/* Export data — no backend endpoint yet */}
        <button
          className="flex items-center justify-between py-3.5 border-b border-gray-50 w-full text-left group hover:bg-gray-50 -mx-1 px-1 rounded-xl transition-colors opacity-50 cursor-not-allowed"
          disabled
          title="Not yet available"
        >
          <div>
            <p className="text-sm font-medium text-gray-800">Export data</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Download your account data — coming soon
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        {/* Delete account — no backend endpoint yet */}
        <button
          className="flex items-center justify-between py-3.5 w-full text-left group hover:bg-rose-50 -mx-1 px-1 rounded-xl transition-colors opacity-50 cursor-not-allowed"
          disabled
          title="Not yet available"
        >
          <div>
            <p className="text-sm font-medium text-rose-600">Delete account</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Permanently delete account — coming soon
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </div>
    </section>
  );
};

export default Page;
