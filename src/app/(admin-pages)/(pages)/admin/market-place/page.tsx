"use client";

import {
  AddInput,
  ButtonWithLoader,
  ConfirmActionModal,
  DatePicker,
  Dialog,
  DialogContent,
  DialogTrigger,
  SelectDropdown,
} from "@/components";
import { ReactNode, useEffect, useState } from "react";
import {
  TMarketPlaceSchema,
  TPromoAndVoucherSchema,
  formatDateToDDMMYYYY,
  marketPlaceSchema,
  promoAndVoucherSchema,
} from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useMarketPlace } from "@/store";
import { useShallow } from "zustand/shallow";
import { ISOStringFormat } from "date-fns";
import { Plus, Tag, Zap, CheckCircle, XCircle } from "lucide-react";

const Page = () => {
  const {
    actions: {
      getRideCostSettings,
      activateOrDeactivateCostSetting,
      getVouchers,
      updateVoucher,
    },
    rideCostSettings,
    allVouchers,
  } = useMarketPlace(
    useShallow((state) => ({
      actions: state.actions,
      rideCostSettings: state.rideCostSettings,
      allVouchers: state.allVouchers,
    })),
  );

  useEffect(() => {
    getRideCostSettings();
    getVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <p className="text-2xl font-bold font-heebo text-gray-900">Marketplace</p>

      {/* Fare Engine Profiles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-violet-50 flex items-center justify-center">
              <Zap size={15} className="text-violet-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Fare Engine Profiles</p>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
              {rideCostSettings.length}
            </span>
          </div>
          <AddOrEditNewFareEngineProfileComponent
            trigger={
              <button className="flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-2 rounded-xl transition-colors">
                <Plus size={14} />
                Add profile
              </button>
            }
          />
        </div>

        {rideCostSettings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Zap size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No fare profiles configured</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {[
                    "Profile",
                    "Updated",
                    "Base Fare",
                    "Surge ×",
                    "Driver Fee",
                    "Haggle",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rideCostSettings.map((setting, i) => {
                  const date = new Date(setting.updatedAt as ISOStringFormat);
                  const {
                    baseFare,
                    baseHagglePercentage,
                    driverToRiderFee,
                    maxHagglePercentage,
                    platformFeePercentage,
                    waitingChargePerMinute,
                    taxPercentage,
                    surgeMultiplier,
                    ...rest
                  } = setting;

                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">{setting.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {setting.currency ?? "USD"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-500">{formatDateToDDMMYYYY(date)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-700">{setting.baseFare}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-700">{setting.surgeMultiplier}×</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{setting.driverToRiderFee}%</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-500">
                          {setting.baseHagglePercentage}–{setting.maxHagglePercentage}%
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            setting.isActive
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-gray-500 bg-gray-100"
                          }`}
                        >
                          {setting.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <AddOrEditNewFareEngineProfileComponent
                            trigger={
                              <button className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors">
                                Edit
                              </button>
                            }
                            defaultValues={{
                              ...rest,
                              baseFare: String(baseFare),
                              baseHagglePercentage: String(baseHagglePercentage),
                              driverToRiderFee: String(driverToRiderFee),
                              maxHagglePercentage: String(maxHagglePercentage),
                              platformFeePercentage: String(platformFeePercentage),
                              waitingChargePerMinute: String(waitingChargePerMinute),
                              taxPercentage: String(taxPercentage),
                              surgeMultiplier: String(surgeMultiplier),
                            }}
                            isEdit
                          />
                          <ConfirmActionModal
                            trigger={
                              <button
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                                  setting.isActive
                                    ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                }`}
                              >
                                {setting.isActive ? "Deactivate" : "Activate"}
                              </button>
                            }
                            confirmActionFunction={() =>
                              activateOrDeactivateCostSetting({
                                costId: setting.id ?? "",
                                isActive: !setting.isActive,
                              })
                            }
                            description={`Are you sure you want to ${setting.isActive ? "deactivate" : "activate"} ${setting.title}?`}
                            title={`${setting.isActive ? "Deactivate" : "Activate"} ${setting.title}`}
                            type={setting.isActive ? "delete" : "reactivate"}
                          />
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

      {/* Promotions & Vouchers */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Tag size={15} className="text-amber-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Promotions & Vouchers</p>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
              {allVouchers.length}
            </span>
          </div>
          <AddOrEditNewPromoVoucherComponent
            trigger={
              <button className="flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-2 rounded-xl transition-colors">
                <Plus size={14} />
                Add voucher
              </button>
            }
          />
        </div>

        {allVouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Tag size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No vouchers created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {[
                    "Code",
                    "Description",
                    "Discount",
                    "Applicable",
                    "Usage",
                    "Valid until",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allVouchers.map((voucher, i) => {
                  const isActive = voucher.status === "ACTIVE";
                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-gray-900 font-mono">
                          {voucher.code}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600 max-w-40 truncate">
                          {voucher.description}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {voucher.discountValue}
                          {voucher.discountType === "percentage" ? "%" : " flat"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                          {voucher.applicableFor}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-500">
                          {voucher.totalUsageCount ?? 0}/{voucher.maxTotalUsage}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-500">
                          {formatDateToDDMMYYYY(new Date(voucher.validUntil))}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {isActive ? (
                            <CheckCircle size={13} className="text-emerald-500" />
                          ) : (
                            <XCircle size={13} className="text-gray-400" />
                          )}
                          <span
                            className={`text-xs font-medium ${isActive ? "text-emerald-700" : "text-gray-500"}`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <ConfirmActionModal
                          trigger={
                            <button
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                                isActive
                                  ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                                  : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                              }`}
                            >
                              {isActive ? "Deactivate" : "Activate"}
                            </button>
                          }
                          confirmActionFunction={() =>
                            updateVoucher({
                              voucherId: voucher.id ?? "",
                              status: isActive ? "DISABLED" : "ACTIVE",
                            })
                          }
                          description={`Are you sure you want to ${isActive ? "deactivate" : "activate"} ${voucher.code}?`}
                          title={`${isActive ? "Deactivate" : "Activate"} ${voucher.code}`}
                          type={isActive ? "delete" : "reactivate"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;

/* ─── Fare Engine Form ─────────────────────────────────────────────── */

type AddOrEditNewFareEngineProfileComponentType = {
  trigger: ReactNode;
  defaultValues?: Partial<TMarketPlaceSchema>;
  isEdit?: boolean;
};

const AddOrEditNewFareEngineProfileComponent = ({
  trigger,
  defaultValues,
  isEdit,
}: AddOrEditNewFareEngineProfileComponentType) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TMarketPlaceSchema>({
    defaultValues,
    resolver: zodResolver(marketPlaceSchema),
  });

  const currency = useWatch({ control, name: "currency" }) ?? "";

  const {
    actions: { createRideCostSettings, updateRideCost: updateRideCostSetting },
    isCreatingCostSetting,
  } = useMarketPlace(
    useShallow((state) => ({
      actions: state.actions,
      isCreatingCostSetting: state.isCreatingCostSetting,
    })),
  );

  const onSubmit = async (data: TMarketPlaceSchema) => {
    const funcCaller = isEdit ? updateRideCostSetting : createRideCostSettings;
    const success = await funcCaller(data);
    if (!success) return;
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        dialogTitle={`${isEdit ? "Edit" : "Add new"} fare profile`}
        className="sm:max-w-106.25 md:max-w-130 px-4 py-8 rounded-[20px]"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-6">
          <p className="font-bold text-2xl">
            {isEdit ? "Edit" : "New"} Profile
          </p>
          <AddInput
            label="Profile name"
            id="title"
            errors={errors}
            placeholder="Rush Hour 22"
            register={register}
            required
            type="text"
            labelClassName="text-sm font-semibold ml-2"
            iconAndInputWrapperClassName="bg-background rounded-2xl p-0"
            withFocusRing
            inputClassName="h-14 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <SelectDropdown
            options={["USD", "NGN"]}
            selected={currency}
            setSelected={(value: string) => setValue("currency", value)}
            triggerLabel="USD"
            triggerClassName="bg-background min-h-14 h-12"
            labelClassName="ml-2"
            label="Currency"
            groupClassName="shadow-lg"
            errorMessage={errors.currency?.message ?? ""}
          />
          <div className="flex gap-4">
            {(
              [
                { id: "baseFare", label: "Base Fare" },
                { id: "driverToRiderFee", label: "Driver fee" },
                { id: "waitingChargePerMinute", label: "Wait/min" },
                { id: "taxPercentage", label: "Tax %" },
              ] as const
            ).map(({ id, label }) => (
              <AddInput
                key={id}
                label={label}
                id={id}
                errors={errors}
                placeholder="0"
                register={register}
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                labelClassName="text-xs font-medium ml-2"
                iconAndInputWrapperClassName="bg-background rounded-lg flex-1 px-0"
                withFocusRing
                inputClassName="h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
            ))}
          </div>
          <div className="flex gap-4">
            {(
              [
                { id: "baseHagglePercentage", label: "Base Haggle %" },
                { id: "maxHagglePercentage", label: "Max Haggle %" },
                { id: "platformFeePercentage", label: "Platform fee" },
                { id: "surgeMultiplier", label: "Surge ×" },
              ] as const
            ).map(({ id, label }) => (
              <AddInput
                key={id}
                label={label}
                id={id}
                errors={errors}
                placeholder="0"
                register={register}
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                withFocusRing
                labelClassName="text-xs font-medium ml-0"
                iconAndInputWrapperClassName="bg-background rounded-lg flex-1 px-0"
                inputClassName="h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
            ))}
          </div>
          <ButtonWithLoader
            text={isEdit ? "Save changes" : "Create profile"}
            isLoading={isCreatingCostSetting}
            onClick={() => handleSubmit(onSubmit)()}
            className="px-14"
            shouldChildrenShowWhenSpinning
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Promo Voucher Form ────────────────────────────────────────────── */

type AddOrEditNewPromoVoucherType = {
  trigger: ReactNode;
  defaultValues?: Partial<TPromoAndVoucherSchema>;
  isEdit?: boolean;
};

const AddOrEditNewPromoVoucherComponent = ({
  trigger,
  defaultValues,
  isEdit,
}: AddOrEditNewPromoVoucherType) => {
  const [open, setOpen] = useState(false);
  const [validFrom, setValidFrom] = useState<Date>();
  const [validFromOpen, setValidFromOpen] = useState(false);
  const [validUntil, setValidUntil] = useState<Date>();
  const [validToOpen, setValidToOpen] = useState(false);

  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TPromoAndVoucherSchema>({
    defaultValues,
    resolver: zodResolver(promoAndVoucherSchema),
  });

  const {
    actions: { createVoucher },
  } = useMarketPlace(
    useShallow((state) => ({ actions: state.actions })),
  );

  const discountType = useWatch({ control, name: "discountType" });
  const applicableFor = useWatch({ control, name: "applicableFor" });

  const onSubmit = async (data: TPromoAndVoucherSchema) => {
    if (!validFrom || !validUntil) return;
    await createVoucher({ ...data, validFrom, validUntil });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        dialogTitle={`${isEdit ? "Edit" : "Add new"} promo voucher`}
        className="sm:max-w-106.25 md:max-w-xl px-4 py-8 rounded-[20px] overflow-y-auto max-h-[90vh]"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-2xl">
            {isEdit ? "Edit" : "New"} Promo Voucher
          </p>
          <AddInput
            label="Promo Code"
            id="code"
            errors={errors}
            placeholder="SUMMER26"
            register={register}
            required
            type="text"
            labelClassName="text-sm font-semibold ml-2"
            iconAndInputWrapperClassName="bg-background rounded-lg p-0"
            withFocusRing
            inputClassName="h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <AddInput
            label="Description"
            id="description"
            errors={errors}
            placeholder="This promo is for summer"
            register={register}
            required
            type="text"
            labelClassName="text-sm font-semibold ml-2"
            iconAndInputWrapperClassName="bg-background rounded-lg p-0"
            withFocusRing
            inputClassName="h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center">
            <SelectDropdown
              options={["percentage", "fixed"]}
              selected={discountType}
              setSelected={(value: string) =>
                setValue("discountType", value as "percentage" | "fixed")
              }
              triggerLabel="Discount Type"
              triggerClassName="bg-background min-h-12 h-12 rounded-lg flex-1"
              labelClassName="text-sm font-semibold ml-2"
              label="Percentage or Fixed"
              groupClassName="shadow-lg"
              fullWidth
              errorMessage={errors.discountType?.message ?? ""}
            />
            <SelectDropdown
              fullWidth
              options={["both", "delivery", "pickup"]}
              selected={applicableFor}
              setSelected={(value: string) =>
                setValue(
                  "applicableFor",
                  value as "both" | "delivery" | "pickup",
                )
              }
              triggerLabel="Applicable For"
              triggerClassName="bg-background min-h-12 h-12 rounded-lg flex-1"
              labelClassName="text-sm font-semibold ml-2"
              label="Both, Delivery or Pickup"
              groupClassName="shadow-lg"
              errorMessage={errors.applicableFor?.message ?? ""}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {(
              [
                {
                  id: "discountValue",
                  label: "Discount Value",
                  placeholder: "10",
                },
                {
                  id: "maxDiscountAmount",
                  label: "Max Discount",
                  placeholder: "10",
                },
                { id: "minOrderAmount", label: "Min Order", placeholder: "5" },
              ] as const
            ).map(({ id, label, placeholder }) => (
              <AddInput
                key={id}
                label={label}
                id={id}
                errors={errors}
                placeholder={placeholder}
                register={register}
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                width="full"
                labelClassName="text-sm font-semibold ml-2"
                iconAndInputWrapperClassName="bg-background rounded-lg flex-1 px-0"
                withFocusRing
                inputClassName="h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {(
              [
                { id: "maxUsagePerUser", label: "Max/user", placeholder: "1" },
                { id: "maxTotalUsage", label: "Max total", placeholder: "2" },
              ] as const
            ).map(({ id, label, placeholder }) => (
              <AddInput
                key={id}
                label={label}
                id={id}
                errors={errors}
                placeholder={placeholder}
                register={register}
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                width="full"
                labelClassName="text-sm font-semibold ml-0"
                iconAndInputWrapperClassName="bg-background rounded-lg flex-1 px-0"
                withFocusRing
                inputClassName="h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <DatePicker
              date={validFrom}
              open={validFromOpen}
              setOpen={setValidFromOpen}
              setDate={setValidFrom}
              label="Valid from"
              placeholder="MM/DD/YYYY"
              fullWidth
              className="h-12 bg-background rounded-lg"
              labelClassName="ml-2 font-semibold"
            />
            <DatePicker
              date={validUntil}
              open={validToOpen}
              setOpen={setValidToOpen}
              setDate={setValidUntil}
              label="Valid to"
              placeholder="MM/DD/YYYY"
              fullWidth
              className="h-12 bg-background rounded-lg"
              labelClassName="ml-2 font-semibold"
            />
          </div>
          <ButtonWithLoader
            text={isEdit ? "Save changes" : "Create voucher"}
            isLoading={false}
            onClick={() => handleSubmit(onSubmit)()}
            className="px-14"
            shouldChildrenShowWhenSpinning
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
