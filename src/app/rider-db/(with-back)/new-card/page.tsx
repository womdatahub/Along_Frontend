"use client";

import { Button, Card, CardContent, HeadingHeebo } from "@/components";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">
        Add payment method
      </HeadingHeebo>
      <Card className="w-full md:w-111.5 rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-4">
          <p className="font-bold text-lg">Use Stripe checkout</p>
          <p className="text-sm text-gray-5">
            For security, card details are entered directly inside Stripe during
            rental checkout. This keeps sensitive payment data out of Along
            frontend state and backend logs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild className="rounded-full w-fit">
              <Link href="/rent-ride">Start rental booking</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full w-fit">
              <Link href="/rider-db/cards">Back to cards</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
