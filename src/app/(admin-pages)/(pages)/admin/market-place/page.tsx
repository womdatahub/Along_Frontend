"use client";

import {
  AddInput,
  Button,
  ButtonWithLoader,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  TMarketPlaceSchema,
  formatDateToDDMMYYYY,
  marketPlaceSchema,
} from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { ISOStringFormat } from "date-fns";

const isEmpty = true;
const Page = () => {
  const {
    actions: { getRideCostSettings, activateOrDeactivateCostSetting },
    rideCostSettings,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      rideCostSettings: state.rideCostSettings,
    })),
  );

  useEffect(() => {
    getRideCostSettings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className='flex flex-col gap-8'>
      <p className='text-2xl md:text-4xl font-heebo'>Market Place</p>

      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex flex-col md:flex-row justify-between gap-5 md:items-center px-6'>
            <p className='text-xl font-medium'>Fare Engine Profile</p>
            <div className='flex items-center gap-5'>
              <AddOrEditNewFareEngineProfileComponent
                trigger={<Button>Add New</Button>}
                defaultValues={{
                  baseFare: "10",
                  baseHagglePercentage: "10",
                  currency: "usd",
                  driverToRiderFee: "10",
                  maxHagglePercentage: "10",
                  platformFeePercentage: "10",
                  waitingChargePerMinute: "10",
                  taxPercentage: "10",
                  surgeMultiplier: "10",
                  title: "Rush 23",
                }}
              />
              <Button variant={"ghost"} className='rounded-full'>
                Batch Delete
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
                <TableHead className='text-[#768B8F] pl-6'>
                  Profile Name
                </TableHead>
                <TableHead className='text-[#768B8F]'>Timestamp</TableHead>
                <TableHead className='text-[#768B8F]'>Base Fare %</TableHead>
                <TableHead className='text-[#768B8F]'>
                  Surge Multiplier %
                </TableHead>
                <TableHead className='text-[#768B8F]'>
                  Driver to Rider Fee %
                </TableHead>
                <TableHead className='text-[#768B8F]'>Base Haggle %</TableHead>
                <TableHead className='text-[#768B8F]'>Max Haggle %</TableHead>
                <TableHead className='text-[#768B8F]'>Action</TableHead>
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
                        <Button
                          onClick={() =>
                            activateOrDeactivateCostSetting({
                              costId: setting.id ?? "",
                              isActive: !setting.isActive,
                            })
                          }
                          className='rounded-full px-2 py-1 text-xs'
                        >
                          {setting.isActive ? "Deactivate" : "Activate"}
                        </Button>

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

                        <Button
                          variant='destructive'
                          className='rounded-full px-2 py-1 text-xs'
                        >
                          Delete
                        </Button>
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
          <div className='flex justify-between gap-5 items-center px-6 pb-3 border-b-[1px] border-b-gray-300'>
            <p className='text-xl font-medium'>Promotion and Vouchers</p>
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
            <p className='text-xl font-medium'>Active Promo</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
                <TableHead className='text-[#768B8F] pl-6'>
                  Promo type
                </TableHead>
                <TableHead className='text-[#768B8F]'>Category</TableHead>
                <TableHead className='text-[#768B8F]'>Duration</TableHead>
                <TableHead className='text-[#768B8F]'>Promo unit</TableHead>
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
  } = useAdmin(
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
        className='sm:max-w-[425px] md:max-w-[520px] px-4 py-8 rounded-[20px]'
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>
            {isEdit ? "Edit" : "Add new"} Fare Engine Profile
          </DialogTitle>
        </VisuallyHidden>
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
