"use client";

import { HeadingHeebo, UploadingImagesReusableComponent } from "@/components";
import { requests } from "@/lib";
import { useSession } from "@/store";
import { ImageType, VehicleInfo } from "@/types";
import { UploadImageIcon } from "@public/svgs";
import {
  BadgeCheck,
  Car,
  ChevronRight,
  Clock,
  Loader2,
  Pencil,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

/*  status badge  */
const STATUS = {
  approved: {
    label: "Active",
    icon: BadgeCheck,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  pending: {
    label: "Pending Review",
    icon: Clock,
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
} as const;

function StatusBadge({ status }: { status?: string }) {
  const cfg = status ? STATUS[status as keyof typeof STATUS] : STATUS.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

/*  edit panel  */
type EditPanelProps = {
  vehicle: VehicleInfo;
  onClose: () => void;
  onSaved: () => void;
};

function EditPanel({ vehicle, onClose, onSaved }: EditPanelProps) {
  const vehicleId = vehicle._id ?? vehicle.vehicleId ?? "";

  const { uploadImages, isLoading } = useSession(
    useShallow((s) => ({
      uploadImages: s.actions.uploadImages,
      isLoading: s.isLoading,
    })),
  );

  const [color, setColor] = useState(vehicle.vehicleColor ?? "");
  const [saving, setSaving] = useState(false);

  /* 0=front, 1=back, 2=side */
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >([null, null, null]);

  const hasImageChanges = previews.some(Boolean);
  const hasColorChange =
    color.trim().toLowerCase() !== (vehicle.vehicleColor ?? "").toLowerCase();
  const canSave = (hasImageChanges || hasColorChange) && !saving && !isLoading;

  const handleSave = async () => {
    if (!vehicleId) {
      toast.error("Vehicle ID missing");
      return;
    }
    setSaving(true);
    try {
      const patch: Record<string, unknown> = {};

      if (hasColorChange) patch.vehicleColor = color.trim();

      if (hasImageChanges) {
        const labels = [
          "vehicleFrontViewImageUri",
          "vehicleBackViewImageUri",
          "vehicleSideViewImageUri",
        ];
        const current = [
          vehicle.vehicleFrontViewImageUri,
          vehicle.vehicleBackViewImageUri,
          vehicle.vehicleSideViewImageUri,
        ];
        await Promise.all(
          previews.map(async (p, i) => {
            if (!p) return;
            const uri = await uploadImages({
              uploadType: "vehicle",
              imageFile: p.image.imageFile,
            });
            if (!uri) throw new Error("Upload failed");
            patch[labels[i]] = uri;
            void current;
          }),
        );
      }

      const { error } = await requests.user.updateVehicle(vehicleId, patch);
      if (error) {
        toast.error("Update failed. Please try again.");
        return;
      }

      toast.success("Vehicle updated — pending admin review");
      onSaved();
    } catch {
      toast.error("Something went wrong during the update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="font-bold text-sm font-heebo text-gray-900">
              Edit Vehicle
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {vehicle.vehicleMake} {vehicle.vehicleModel} ·{" "}
              {vehicle.vehicleYear}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Pending notice */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Clock size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Any updates will set this vehicle back to{" "}
              <strong>Pending Review</strong> until an admin approves the
              changes.
            </p>
          </div>

          {/* Color */}
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Vehicle color
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Pearl White"
              className="h-11 rounded-xl bg-background px-4 text-sm outline-none border border-gray-200 focus:border-primary transition-colors"
            />
          </label>

          {/* Images */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">
              Vehicle photos{" "}
              <span className="text-xs text-gray-400 font-normal">
                (leave blank to keep current)
              </span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(["Front", "Back", "Side"] as const).map((label, i) => (
                <UploadingImagesReusableComponent
                  key={label}
                  index={i}
                  previews={previews}
                  setPreviews={setPreviews}
                  className="justify-center items-center rounded-xl bg-background text-placeholder w-full h-24"
                  imageToastDescription={`${label} view`}
                >
                  <div className="flex flex-col gap-1.5 items-center text-center">
                    <UploadImageIcon />
                    <p className="text-xs font-medium">{label}</p>
                  </div>
                </UploadingImagesReusableComponent>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-deep disabled:opacity-40 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Pencil size={14} />
              )}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*  vehicle card  */
function VehicleCard({
  vehicle,
  onEdit,
}: {
  vehicle: VehicleInfo;
  onEdit: () => void;
}) {
  const imageUri = vehicle.vehicleFrontViewImageUri;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-colors group">
      {/* Image strip */}
      <div className="relative h-40 bg-gray-50 overflow-hidden">
        {imageUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUri}
            alt={`${vehicle.vehicleMake} ${vehicle.vehicleModel}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={36} className="text-gray-300" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={vehicle.kycStatus} />
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-900 font-heebo truncate">
            {vehicle.vehicleMake} {vehicle.vehicleModel}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {vehicle.vehicleYear} · {vehicle.vehicleColor}
            {vehicle.vehicleClass && ` · ${vehicle.vehicleClass}`}
          </p>
          <p className="text-xs text-gray-300 mt-1 font-mono">
            {vehicle.vehicleIdentificationNumber}
          </p>
        </div>
        <button
          onClick={onEdit}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary bg-primaryLight2 hover:bg-primaryLight px-3 py-2 rounded-xl transition-colors"
        >
          <Pencil size={12} />
          Edit
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

/*  page  */
const Page = () => {
  const { driverProfile } = useSession(
    useShallow((s) => ({ driverProfile: s.driverProfile })),
  );

  const [vehicles, setVehicles] = useState<VehicleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<VehicleInfo | null>(
    null,
  );

  const load = useCallback(async () => {
    const driverId = driverProfile?.driverId ?? driverProfile?._id;
    if (!driverId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await requests.user.getVehicleByDriverId(driverId);
      // API may return array, wrapped object, or single vehicle
      const raw = data as unknown;
      let list: VehicleInfo[];
      if (Array.isArray(raw)) {
        list = raw as VehicleInfo[];
      } else if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (obj.data && Array.isArray(obj.data))
          list = obj.data as VehicleInfo[];
        else if (obj.vehicle) list = [obj.vehicle as VehicleInfo];
        else if (obj.data) list = [obj.data as VehicleInfo];
        else list = [raw as VehicleInfo];
      } else {
        list = [];
      }
      setVehicles(list.filter(Boolean));
    } catch {
      toast.error("Could not load vehicles");
    } finally {
      setLoading(false);
    }
  }, [driverProfile]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">My Vehicles</HeadingHeebo>

      {/* Mobile-listing notice */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 w-full md:max-w-8xl">
        <Car size={16} className="text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600 leading-relaxed">
          Vehicle listing and availability for rentals is managed through the{" "}
          <strong className="text-primary">Along mobile app</strong>. Here you
          can view your vehicles and update details like colour or photos (e.g.
          after a repaint).
        </p>
      </div>

      {/* Vehicle list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-gray-100 w-full md:max-w-8xl">
          <div className="size-14 rounded-2xl bg-background flex items-center justify-center">
            <Car size={24} className="text-gray" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">
              No vehicles found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Register a vehicle through the mobile app to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 w-full md:max-w-8xl">
          {vehicles.map((v) => (
            <VehicleCard
              key={v._id ?? v.vehicleId}
              vehicle={v}
              onEdit={() => setEditingVehicle(v)}
            />
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingVehicle && (
        <EditPanel
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSaved={() => {
            setEditingVehicle(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default Page;
