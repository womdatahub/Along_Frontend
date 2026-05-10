"use client";

import { Button, Card, CardContent, HeadingHeebo } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment } from "@/store";
import Link from "next/link";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const money = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);

const Page = () => {
  const {
    isLoading,
    walletDetails,
    actions: { fetchWalletDetails },
  } = usePayment(
    useShallow((state) => ({
      isLoading: state.isLoading,
      walletDetails: state.walletDetails,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    fetchWalletDetails();
  }, [fetchWalletDetails]);

  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Wallet</HeadingHeebo>
      <Card className='w-full md:w-111.5 rounded-2xl shadow-none overflow-hidden'>
        <CardContent className='flex flex-col gap-8 items-center'>
          {isLoading ? (
            <Skeleton className='h-28 w-full rounded-2xl' />
          ) : (
            <>
              <div className='flex flex-col gap-1 font-heebo text-center'>
                <p className='text-base text-gray-5'>Main balance</p>
                <p className='font-semibold font-heebo text-4xl'>
                  {money(walletDetails?.mainBalance)}
                </p>
              </div>
              <div className='grid grid-cols-2 gap-3 w-full text-sm'>
                <div className='rounded-2xl bg-background-1 p-4'>
                  <p className='text-gray-5'>Referral balance</p>
                  <p className='font-bold'>
                    {money(walletDetails?.referralBalance)}
                  </p>
                </div>
                <div className='rounded-2xl bg-background-1 p-4'>
                  <p className='text-gray-5'>Wallet status</p>
                  <p className='font-bold'>
                    {walletDetails ? "Active" : "Unavailable"}
                  </p>
                </div>
              </div>
            </>
          )}
          <div className='flex flex-col gap-2 text-sm text-gray-5'>
            <p>
              Rental payments are currently processed through Stripe checkout.
              Wallet top-up endpoints are not active yet, so this screen only
              displays backend wallet balances.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button asChild className='rounded-full w-fit'>
              <Link href='/rent-ride'>Book rental</Link>
            </Button>
            <Button
              variant='secondary'
              className='rounded-full w-fit'
              onClick={() => fetchWalletDetails()}
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
