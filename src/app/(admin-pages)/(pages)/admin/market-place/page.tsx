"use client";

import {
  AddInput,
  Button,
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
import { ReactNode, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { TMarketPlaceSchema, marketPlaceSchema } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const isEmpty = true;
const Page = () => {
  return (
    <section className='flex flex-col gap-8'>
      <p className='text-4xl font-heebo'>Market Place</p>

      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex justify-between gap-5 items-center px-6'>
            <p className='text-xl font-medium'>Fare Engine Profile</p>
            <div className='flex items-center gap-5'>
              <AddOrEditNewFareEngineProfileComponent
                trigger={<Button>Add New</Button>}
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

            {isEmpty ? (
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
  defaultValues?: TMarketPlaceSchema;
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
    // handleSubmit,
    formState: { errors },
  } = useForm<TMarketPlaceSchema>({
    defaultValues,
    resolver: zodResolver(marketPlaceSchema),
  });
  const currency = watch("currency");

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
            id='profileName'
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
              id='waitChargePerMin'
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
              id='tax'
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
              id='baseHaggle'
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
              id='maxHaggle'
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
              id='platformFee'
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
          <Button className='px-14'>{isEdit ? "Edit" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
