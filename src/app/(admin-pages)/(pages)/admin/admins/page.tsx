"use client";

import { useEffect, useState, useMemo } from "react";
import { AddNewAdminModal } from "@/components/";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Separator,
  Checkbox,
  ButtonWithLoader,
  LoadingSpinner,
} from "@/components/";
import {
  UserPlus,
  RefreshCw,
  Shield,
  Users,
  UserX,
  Mail,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib";
import { useAdmin, usePermission } from "@/store";
import { useShallow } from "zustand/shallow";
import { AdminsType } from "@/types";
import { RolePermission } from "@/types";

/* ─── Admin Detail Modal  */

const AdminDetailModal = ({
  admin,
  open,
  onOpenChange,
}: {
  admin: AdminsType;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const {
    actions: {
      getSingleAdminPermissions,
      grantAdminPermission,
      revokeAdminPermission,
      getAllRolePermissions,
    },
    allRolePermissions,
    isLoading,
    isFetching,
    singleAdminPermission,
  } = usePermission(
    useShallow((state) => ({
      actions: state.actions,
      allRolePermissions: state.allRolePermissions,
      isLoading: state.isLoading,
      isFetching: state.isFetching,
      singleAdminPermission: state.singleAdminPermission,
    })),
  );

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [checkedPermissions, setCheckedPermissions] = useState<Record<string, boolean>>({});

  // Load permissions when modal opens
  useEffect(() => {
    if (open) {
      getAllRolePermissions();
      getSingleAdminPermissions(admin.adminId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, admin.adminId]);

  const currentPermissions = singleAdminPermission ?? [];

  const currentPermissionIds = useMemo(
    () => new Set(currentPermissions.map((ep) => ep.id)),
    [currentPermissions],
  );

  const additionalMap = useMemo(() => {
    const m = new Map<string, RolePermission[string]["endpoints"][number]>();
    Object.entries(allRolePermissions ?? {}).forEach(([, data]) => {
      data.endpoints.forEach((ep) => {
        if (!currentPermissionIds.has(ep.id) && !m.has(ep.id)) m.set(ep.id, ep);
      });
    });
    return m;
  }, [allRolePermissions, currentPermissionIds]);

  const additionalEndpoints = useMemo(() => Array.from(additionalMap.values()), [additionalMap]);

  // Seed checkboxes when permissions load
  useEffect(() => {
    if (currentPermissions.length === 0) return;
    const initial: Record<string, boolean> = {};
    currentPermissions.forEach((ep) => { initial[ep.id] = ep.isActive; });
    additionalEndpoints.forEach((ep) => { initial[ep.id] = false; });
    queueMicrotask(() => {
      setCheckedPermissions(initial);
      setOpenCategories({});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPermissions]);

  const groupEndpoints = (eps: typeof additionalEndpoints) =>
    eps.reduce<Record<string, typeof additionalEndpoints>>((acc, ep) => {
      if (!acc[ep.category]) acc[ep.category] = [];
      acc[ep.category].push(ep);
      return acc;
    }, {});

  const selectedGrouped = groupEndpoints(currentPermissions);
  const additionalGrouped = groupEndpoints(additionalEndpoints);

  const CHECKED_IDS = Object.entries(checkedPermissions).filter(([, v]) => v).map(([id]) => id);
  const UNCHECKED_IDS = Object.entries(checkedPermissions).filter(([, v]) => !v).map(([id]) => id);

  const toggleCategory = (cat: string, section: string) =>
    setOpenCategories((prev) => ({ ...prev, [`${section}_${cat}`]: !prev[`${section}_${cat}`] }));

  const togglePermission = (id: string) =>
    setCheckedPermissions((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatCat = (cat: string) =>
    cat.split("_").map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");

  const tealCheckbox =
    "h-[15px] w-[15px] cursor-pointer rounded-sm border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]";

  const renderGroup = (grouped: Record<string, typeof additionalEndpoints>, section: string) =>
    Object.entries(grouped).map(([cat, eps]) => {
      const key = `${section}_${cat}`;
      const isOpen = openCategories[key] ?? false;
      return (
        <div key={key} className="border-t border-gray-100">
          <button
            type="button"
            onClick={() => toggleCategory(cat, section)}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <span className="text-sm font-medium text-gray-700">{formatCat(cat)}</span>
            {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          </button>
          {isOpen && (
            <div className="flex flex-col gap-3 pb-4 pl-1">
              {eps.map((ep) => (
                <div key={ep.id} className="flex items-center gap-2.5">
                  <Checkbox
                    checked={checkedPermissions[ep.id] ?? false}
                    onCheckedChange={() => togglePermission(ep.id)}
                    className={tealCheckbox}
                  />
                  <label
                    className="text-sm text-gray-600 cursor-pointer"
                    onClick={() => togglePermission(ep.id)}
                  >
                    {ep.description}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });

  const initials = `${admin.firstName?.[0] ?? ""}${admin.lastName?.[0] ?? ""}`.toUpperCase();
  const isActive = admin.status === "active";

  const handleSave = async () => {
    await grantAdminPermission({
      adminId: admin.adminId,
      endpointIds: CHECKED_IDS,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    await revokeAdminPermission({ adminId: admin.adminId, endpointIds: UNCHECKED_IDS });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dialogTitle={`${admin.firstName} ${admin.lastName} — Admin Detail`}
        className="max-w-sm md:max-w-xl max-h-[88vh] p-0 overflow-y-auto rounded-2xl gap-0 [&>button]:hidden flex flex-col"
      >
        {isFetching ? (
          <div className="flex-1 flex items-center justify-center min-h-[40vh]">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Profile header */}
            <div className="px-7 pt-7 pb-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 font-heebo truncate">
                    {admin.firstName} {admin.lastName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} className="text-gray-400" />
                    <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full capitalize">
                      <Shield size={11} />
                      {admin.role.toLowerCase().split("_").join(" ")}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        isActive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                      }`}
                    >
                      {isActive ? "Active" : "Suspended"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">Admin ID</p>
                  <p className="font-mono text-xs text-gray-700 truncate">
                    #{admin.adminId?.slice(-8) ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">Member since</p>
                  <p className="text-xs text-gray-700">
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Permissions editor */}
            <div className="flex-1 px-7 pt-5 pb-4 overflow-y-auto flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck size={15} className="text-primary" />
                <p className="text-sm font-semibold text-gray-900">Role permissions</p>
              </div>

              {currentPermissions.length === 0 && additionalEndpoints.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No permissions loaded.</p>
              ) : (
                <>
                  {renderGroup(selectedGrouped, "role")}
                  {Object.keys(additionalGrouped).length > 0 && (
                    <>
                      <p className="text-sm font-semibold text-gray-700 mt-5 mb-2">
                        Additional permissions
                      </p>
                      {renderGroup(additionalGrouped, "additional")}
                    </>
                  )}
                </>
              )}
            </div>

            <Separator />
            <div className="flex items-center justify-between px-7 py-4">
              <button
                onClick={() => onOpenChange(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
              <ButtonWithLoader
                text="Save permissions"
                shouldChildrenShowWhenSpinning
                isLoading={isLoading}
                className="rounded-xl px-5"
                onClick={handleSave}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ─── Page ────────────── */

const Page = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminsType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "suspended">("active");

  const {
    actions: { getAllActiveAdmins, getAllSuspendedAdmins, suspendAdmin, restoreAdmin },
    allActiveAdmins,
    allSuspendedAdmins,
    isLoading,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      allActiveAdmins: state.allActiveAdmins,
      allSuspendedAdmins: state.allSuspendedAdmins,
      isLoading: state.isLoading,
    })),
  );

  const allAdmins = useMemo(
    () => [...allActiveAdmins, ...allSuspendedAdmins],
    [allActiveAdmins, allSuspendedAdmins],
  );

  const displayedAdmins = activeTab === "active" ? allActiveAdmins : allSuspendedAdmins;

  useEffect(() => {
    getAllActiveAdmins();
    getAllSuspendedAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdminDetail = (admin: AdminsType) => {
    setSelectedAdmin(admin);
    setModalOpen(true);
  };

  const tabs = [
    { key: "active" as const, label: "Active", count: allActiveAdmins.length },
    { key: "suspended" as const, label: "Suspended", count: allSuspendedAdmins.length },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-2xl font-bold font-heebo text-gray-900">Admins</p>
        <div className="flex items-center gap-2">
          <AddNewAdminModal
            trigger={
              <button className="flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl transition-colors">
                <UserPlus size={15} />
                Add admin
              </button>
            }
          />
          <button
            onClick={() => { getAllActiveAdmins(); getAllSuspendedAdmins(); }}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs text-gray-400 font-medium">Total admins</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allAdmins.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs text-gray-400 font-medium">Active</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{allActiveAdmins.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs text-gray-400 font-medium">Suspended</p>
          <p className="text-2xl font-bold text-rose-500 mt-1">{allSuspendedAdmins.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {displayedAdmins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              {activeTab === "active" ? (
                <Users size={22} className="text-gray-300" />
              ) : (
                <UserX size={22} className="text-gray-300" />
              )}
            </div>
            <p className="text-sm text-gray-400">
              {activeTab === "active" ? "No active admins" : "No suspended admins"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Admin
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedAdmins.map((admin, i) => {
                  const isActive = admin.status === "active";
                  return (
                    <tr
                      key={i}
                      onClick={() => openAdminDetail(admin)}
                      className="border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary uppercase">
                              {(admin.firstName?.[0] ?? "") + (admin.lastName?.[0] ?? "")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                              {admin.firstName} {admin.lastName}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg capitalize">
                          {admin.role.toLowerCase().split("_").join(" ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isActive
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-rose-700 bg-rose-50"
                          }`}
                        >
                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isActive ? (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await suspendAdmin({
                                  adminId: admin.adminId,
                                  reason: "Suspended by super admin",
                                });
                              }}
                              className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await restoreAdmin({ adminId: admin.adminId });
                              }}
                              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Restore
                            </button>
                          )}
                          <span className="text-xs text-gray-300 group-hover:text-primary transition-colors font-medium">
                            View →
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin detail modal */}
      {selectedAdmin && (
        <AdminDetailModal
          admin={selectedAdmin}
          open={modalOpen}
          onOpenChange={(v) => {
            setModalOpen(v);
            if (!v) setSelectedAdmin(null);
          }}
        />
      )}
    </section>
  );
};

export default Page;
