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
} from "lucide-react";
import { useSession } from "@/store";
import { useShallow } from "zustand/shallow";

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
  const { userRole } = useSession(useShallow((s) => ({ userRole: s.userRole })));
  const isAdmin = !userRole || userRole === "admin" || userRole === "SUPER_ADMIN";

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

  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    loginAlerts: true,
  });

  // Hydrate dark mode from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("along-dark-mode") === "true";
    setAppearance((prev) => ({ ...prev, darkMode: stored }));
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  const toggle = <K extends keyof typeof notifications>(key: K) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleAppearance = <K extends keyof typeof appearance>(key: K, value?: boolean) => {
    const next = value !== undefined ? value : !appearance[key];
    setAppearance((prev) => ({ ...prev, [key]: next }));

    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("along-dark-mode", String(next));
    }
  };

  const toggleSecurity = <K extends keyof typeof security>(key: K) =>
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }));

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
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
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
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
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

        {[
          {
            key: "twoFactor" as const,
            label: "Two-factor authentication",
            description: "Require 2FA on every login",
            icon: Shield,
          },
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
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
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
        {[
          { label: "Change password", description: "Update your account password" },
          { label: "Export data", description: "Download your account data" },
          {
            label: "Delete account",
            description: "Permanently delete account",
            danger: true,
          },
        ].map((item) => (
          <button
            key={item.label}
            className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-b-0 w-full text-left group hover:bg-gray-50 -mx-1 px-1 rounded-xl transition-colors"
          >
            <div>
              <p
                className={`text-sm font-medium ${item.danger ? "text-rose-600" : "text-gray-800"}`}
              >
                {item.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Page;
