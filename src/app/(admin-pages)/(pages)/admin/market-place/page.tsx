"use client";

import {
  AddInput,
  Button,
  ButtonWithLoader,
  Card,
  CardContent,
  ConfirmActionModal,
  DatePicker,
  Dialog,
  DialogContent,
  DialogTrigger,
  Empty,
  EmptyHeader,
  EmptyTitle,
  SelectDropdown,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { useForm } from "react-hook-form";
import { useMarketPlace } from "@/store";
import { useShallow } from "zustand/shallow";
import { ISOStringFormat } from "date-fns";

const isEmpty = true;
const Page = () => {
  const {
    actions: {
      getRideCostSettings,
      activateOrDeactivateCostSetting,
      getVouchers,
    },
    rideCostSettings,
  } = useMarketPlace(
    useShallow((state) => ({
      actions: state.actions,
      rideCostSettings: state.rideCostSettings,
    })),
  );

  useEffect(() => {
    getRideCostSettings();
    getVouchers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className='flex flex-col gap-8'>
      <p className='text-2xl md:text-4xl font-heebo'>Market Place</p>

      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex justify-between gap-5 md:items-center px-6'>
            <p className='text-lg md:text-xl font-medium'>
              Fare Engine Profile
            </p>
            <div className='flex items-center gap-5'>
              <AddOrEditNewFareEngineProfileComponent
                trigger={<Button>Add New</Button>}
              />
              {/* <Button variant={"ghost"} className='rounded-full'>
                Batch Delete
              </Button> */}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
                <TableHead className='text-icons pl-6'>Profile Name</TableHead>
                <TableHead className='text-icons'>Timestamp</TableHead>
                <TableHead className='text-icons'>Base Fare %</TableHead>
                <TableHead className='text-icons'>Surge Multiplier %</TableHead>
                <TableHead className='text-icons'>
                  Driver to Rider Fee %
                </TableHead>
                <TableHead className='text-icons'>Base Haggle %</TableHead>
                <TableHead className='text-icons'>Max Haggle %</TableHead>
                <TableHead className='text-icons'>Action</TableHead>
              </TableRow>
            </TableHeader>

            {rideCostSettings.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} className='p-10'>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No information found</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
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
                    <TableRow key={i} className='last:border-b-0'>
                      <TableCell className=' text-sm font-medium pl-6'>
                        {setting.title}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {formatDateToDDMMYYYY(date)}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {setting.baseFare}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {setting.surgeMultiplier}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {setting.driverToRiderFee}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {setting.baseHagglePercentage}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {setting.maxHagglePercentage}
                      </TableCell>
                      <TableCell className=' flex gap-3 items-center'>
                        <ConfirmActionModal
                          trigger={
                            <Button className='rounded-full px-2 py-1 text-xs'>
                              {setting.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          }
                          confirmActionFunction={() =>
                            activateOrDeactivateCostSetting({
                              costId: setting.id ?? "",
                              isActive: !setting.isActive,
                            })
                          }
                          description={`Are you sure you want to ${setting.isActive ? "deactivate" : "activate"} ${setting.title}`}
                          title={`${setting.isActive ? "Deactivate" : "Activate"} ${setting.title}?`}
                          type={setting.isActive ? "delete" : "reactivate"}
                        />
                        {/* <Button
                          onClick={() =>
                            activateOrDeactivateCostSetting({
                              costId: setting.id ?? "",
                              isActive: !setting.isActive,
                            })
                          }
                          className='rounded-full px-2 py-1 text-xs'
                        >
                          {setting.isActive ? "Deactivate" : "Activate"}
                        </Button> */}

                        <AddOrEditNewFareEngineProfileComponent
                          trigger={
                            <Button
                              key={i}
                              className='rounded-full px-2 py-1 text-xs'
                            >
                              Update
                            </Button>
                          }
                          defaultValues={{
                            ...rest,
                            baseFare: String(baseFare),
                            baseHagglePercentage: String(baseHagglePercentage),
                            driverToRiderFee: String(driverToRiderFee),
                            maxHagglePercentage: String(maxHagglePercentage),
                            platformFeePercentage: String(
                              platformFeePercentage,
                            ),
                            waitingChargePerMinute: String(
                              waitingChargePerMinute,
                            ),
                            taxPercentage: String(taxPercentage),
                            surgeMultiplier: String(surgeMultiplier),
                          }}
                          isEdit
                        />

                        <ConfirmActionModal
                          trigger={
                            <Button
                              variant='destructive'
                              className='rounded-full px-2 py-1 text-xs'
                            >
                              Delete
                            </Button>
                          }
                          confirmActionFunction={() => {}}
                          description={`Are you sure you want to delete ${setting.title}`}
                          title={`Delete ${setting.title}?`}
                          type='delete'
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex justify-between gap-5 items-center px-6 pb-3 border-b border-b-gray-300'>
            <p className='text-lg md:text-xl font-medium'>
              Promotion and Vouchers
            </p>
            <AddOrEditNewPromoVoucherComponent
              trigger={<Button>Add New</Button>}
            />
          </div>
          <Table>
            {isEmpty ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className='p-10'>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No information found</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {alertTables.map((alert, i) => {
                  return (
                    <TableRow key={i} className='last:border-b-0'>
                      <TableCell className=' text-sm font-medium pl-6'>
                        {alert.type}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.timeStamp}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.tripID}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.initiator}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex justify-between gap-5 items-center px-6'>
            <p className='text-lg md:text-xl font-medium'>Active Promo</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
                <TableHead className='text-icons pl-6'>Promo type</TableHead>
                <TableHead className='text-icons'>Category</TableHead>
                <TableHead className='text-icons'>Duration</TableHead>
                <TableHead className='text-icons'>Promo unit</TableHead>
              </TableRow>
            </TableHeader>

            {isEmpty ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className='p-10'>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No information found</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {alertTables.map((alert, i) => {
                  return (
                    <TableRow key={i} className='last:border-b-0'>
                      <TableCell className=' text-sm font-medium pl-6'>
                        {alert.type}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.timeStamp}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.tripID}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.initiator}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};
export default Page;

type Alert = {
  type: string;
  timeStamp: string;
  tripID: string;
  initiator: string;
};

const alertTables: Alert[] = [];

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
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TMarketPlaceSchema>({
    defaultValues,
    resolver: zodResolver(marketPlaceSchema),
  });
  const currency = watch("currency") ?? "";

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
        dialogTitle={`${isEdit ? "Edit" : "Add new"} Fare Engine Profile`}
        className='sm:max-w-106.25 md:max-w-130 px-4 py-8 rounded-[20px]'
        showCloseButton={false}
      >
        <div className='flex flex-col gap-6'>
          <p className='-5 font-bold text-2xl'>
            {isEdit ? "Edit" : "New"} Profile
          </p>
          <AddInput
            label='Profile name'
            id='title'
            errors={errors}
            placeholder='Rush Hour 22'
            register={register}
            required
            type='text'
            labelClassName='text-sm font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-2xl p-0'
            withFocusRing
            inputClassName='h-14 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
          <SelectDropdown
            options={["USD", "NGN"]}
            selected={currency}
            setSelected={(value: string) => {
              setValue("currency", value);
            }}
            triggerLabel='USD'
            triggerClassName='bg-background-1 min-h-14 h-12'
            labelClassName='ml-2'
            label='Currency'
            groupClassName='shadow-lg'
            errorMessage={errors.currency?.message ?? ""}
          />
          <div className='flex gap-4'>
            <AddInput
              label='Base Fare'
              id='baseFare'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              labelClassName='text-xs font-medium ml-2'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              withFocusRing
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Driver to rider fee'
              id='driverToRiderFee'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              labelClassName='text-xs font-medium ml-2'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              withFocusRing
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Wait charge/min'
              id='waitingChargePerMinute'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              labelClassName='text-xs font-medium ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              withFocusRing
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Tax %'
              id='taxPercentage'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              labelClassName='text-xs font-medium ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
          </div>
          <div className='flex gap-4'>
            <AddInput
              label='Base Haggle %'
              id='baseHagglePercentage'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              labelClassName='text-xs font-medium ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Max Haggle %'
              id='maxHagglePercentage'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              labelClassName='text-xs font-medium ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Platform fee'
              id='platformFeePercentage'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              labelClassName='text-xs font-medium ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Surge multiplier'
              id='surgeMultiplier'
              errors={errors}
              placeholder='0'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              labelClassName='text-xs font-medium ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
          </div>
          <ButtonWithLoader
            text={isEdit ? "Edit" : "Save"}
            isLoading={isCreatingCostSetting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            className='px-14'
            shouldChildrenShowWhenSpinning
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
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
    watch,
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
    useShallow((state) => ({
      actions: state.actions,
    })),
  );

  const discountType = watch("discountType");
  const applicableFor = watch("applicableFor");

  const onSubmit = async (data: TPromoAndVoucherSchema) => {
    if (!validFrom || !validUntil) return;
    await createVoucher({
      ...data,
      validFrom,
      validUntil,
    });

    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        dialogTitle={`${isEdit ? "Edit" : "Add new"} Promo Voucher`}
        className='sm:max-w-106.25 md:max-w-xl px-4 py-8 rounded-[20px] overflow-y-auto max-h-[90vh]'
        showCloseButton={false}
      >
        <div className='flex flex-col gap-4 md:gap-6'>
          <p className='-5 font-bold text-2xl'>
            {isEdit ? "Edit" : "New"} Promo Voucher
          </p>
          <AddInput
            label='Promo Code'
            id='code'
            errors={errors}
            placeholder='SUMMER26'
            register={register}
            required
            type='text'
            labelClassName='text-sm font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-lg p-0'
            withFocusRing
            inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
          <AddInput
            label='Promo description'
            id='description'
            errors={errors}
            placeholder='This promo is for summer'
            register={register}
            required
            type='text'
            labelClassName='text-sm font-semibold ml-2'
            iconAndInputWrapperClassName='bg-background-1 rounded-lg p-0'
            withFocusRing
            inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
          />
          <div className='flex flex-col md:flex-row gap-4 md:gap-6 md:items-center'>
            <SelectDropdown
              options={["percentage", "fixed"]}
              selected={discountType}
              setSelected={(value: string) => {
                setValue("discountType", value as "percentage" | "fixed");
              }}
              triggerLabel='Discount Type'
              triggerClassName='bg-background-1 min-h-12 h-12 rounded-lg flex-1'
              labelClassName='text-sm font-semibold ml-2'
              label='Percentage or Fixed Amount'
              groupClassName='shadow-lg'
              fullWidth
              errorMessage={errors.discountType?.message ?? ""}
            />
            <SelectDropdown
              fullWidth
              options={["both", "delivery", "pickup"]}
              selected={applicableFor}
              setSelected={(value: string) => {
                setValue(
                  "applicableFor",
                  value as "both" | "delivery" | "pickup",
                );
              }}
              triggerLabel='Applicable For'
              triggerClassName='bg-background-1 min-h-12 h-12 rounded-lg flex-1'
              labelClassName='text-sm font-semibold ml-2'
              label='Both, Delivery or Pickup'
              groupClassName='shadow-lg'
              errorMessage={errors.applicableFor?.message ?? ""}
            />
          </div>

          <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
            <AddInput
              label='Discount Value'
              id='discountValue'
              errors={errors}
              placeholder='10'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              width='full'
              labelClassName='text-sm font-semibold ml-2'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              withFocusRing
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Max Discount Amount'
              id='maxDiscountAmount'
              errors={errors}
              placeholder='10'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              width='full'
              labelClassName='text-sm font-semibold ml-2'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              label='Minimum Order Amount'
              id='minOrderAmount'
              errors={errors}
              placeholder='5'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              width='full'
              labelClassName='text-sm font-semibold ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
          </div>
          <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
            <AddInput
              label='Max Usage per user'
              id='maxUsagePerUser'
              errors={errors}
              placeholder='1'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              width='full'
              labelClassName='text-sm font-semibold ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
            <AddInput
              width='full'
              label='Max Total Usage'
              id='maxTotalUsage'
              errors={errors}
              placeholder='2'
              register={register}
              required
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              withFocusRing
              labelClassName='text-sm font-semibold ml-0'
              iconAndInputWrapperClassName='bg-background-1 rounded-lg flex-1 px-0'
              inputClassName='h-12 placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
            />
          </div>
          <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
            <DatePicker
              date={validFrom}
              open={validFromOpen}
              setOpen={setValidFromOpen}
              setDate={setValidFrom}
              label='Valid from'
              placeholder='MM/DD/YYYY'
              fullWidth
              className='h-12 bg-background-1 rounded-lg'
              labelClassName='ml-2 font-semibold'
            />
            <DatePicker
              date={validUntil}
              open={validToOpen}
              setOpen={setValidToOpen}
              setDate={setValidUntil}
              label='Valid to'
              placeholder='MM/DD/YYYY'
              fullWidth
              className='h-12 bg-background-1 rounded-lg'
              labelClassName='ml-2 font-semibold'
            />
          </div>

          <ButtonWithLoader
            text={isEdit ? "Edit" : "Save"}
            isLoading={false}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            className='px-14'
            shouldChildrenShowWhenSpinning
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
