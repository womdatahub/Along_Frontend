"use client";

import {
  Button,
  Card,
  CardContent,
  Empty,
  EmptyHeader,
  EmptyTitle,
  HeadingHeebo,
} from "@/components";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">Payment cards</HeadingHeebo>
      <Card className="w-full md:w-111.5 rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-5">
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="font-bold text-xl">
                Cards are handled securely at checkout
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
          <p className="text-sm text-gray-5">
            Along does not collect or display raw card details in the app.
            Stripe collects payment details only when you pay for a rental.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="rounded-full w-fit">
              <Link href="/rent-ride">Book a rental</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full w-fit">
              <Link href="/rider-db/wallets">View wallet</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
