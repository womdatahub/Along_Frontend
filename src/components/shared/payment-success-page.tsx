"use client";

import { ReactNode, useState } from "react";
import { Badge, Button, Card, CardContent, Separator } from "@/components";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { useRental } from "@/store";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { ROLE_DASHBOARD_MAP } from "@/lib";

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | ReactNode;
  mono?: boolean;
}) {
  return (
    <div className='flex items-center justify-between py-3'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <span
        className={`text-sm font-medium text-foreground ${
          mono ? "font-mono tracking-tight" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export const PaymentSuccess = () => {
  const { intent } = useRental(
    useShallow((state) => ({ intent: state.intent })),
  );

  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(intent?.paymentIntent.intentId ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center space-y-3'>
          <div className='flex justify-center'>
            <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center'>
              <CheckCircle2
                className='w-8 h-8 text-green-600'
                strokeWidth={1.75}
              />
            </div>
          </div>
          <div className='space-y-1'>
            <Badge
              variant='secondary'
              className='bg-green-100 text-green-700 hover:bg-green-100 text-xs tracking-wide uppercase'
            >
              Payment Successful
            </Badge>
            <h1 className='text-2xl font-semibold text-foreground tracking-tight pt-1'>
              Your payment was received
            </h1>
            <p className='text-sm text-muted-foreground'>
              A confirmation has been sent to your email.
            </p>
          </div>
        </div>

        <Card className='shadow-sm border border-border/60'>
          <div className='bg-green-600 rounded-t-xl px-6 py-5 text-center'>
            <p className='text-green-100 text-xs uppercase tracking-widest mb-1'>
              Amount Paid
            </p>
            <p className='text-4xl font-bold text-white'>
              {intent?.paymentIntent.total}
            </p>
          </div>

          <CardContent className='px-6 pt-2 pb-4 space-y-0'>
            <DetailRow
              label='Base fare'
              value={intent?.paymentIntent.baseCost}
              mono
            />
            <Separator />
            <DetailRow label='Tax' value={intent?.paymentIntent.tax} />
            <Separator />

            <div className='mt-4 bg-muted rounded-lg px-4 py-3 flex items-center justify-between'>
              <div>
                <p className='text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5'>
                  Transaction Ref
                </p>
                <p className='font-mono text-sm font-medium text-foreground'>
                  {intent?.paymentIntent.intentId ?? "-"}
                </p>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={copyRef}
                className='h-8 px-3 text-xs text-muted-foreground hover:text-foreground'
              >
                {copied ? (
                  <Check className='w-3.5 h-3.5 text-green-600' />
                ) : (
                  <Copy className='w-3.5 h-3.5' />
                )}
                <span className='ml-1.5'>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          className='w-full font-medium text-sm'
          onClick={() => {
            useRental.persist.clearStorage();
            router.push(ROLE_DASHBOARD_MAP["rider"]);
          }}
        >
          Go to Dashboard →
        </Button>

        <p className='text-center text-xs text-muted-foreground'>
          Need help?{" "}
          <a
            href='#'
            className='underline underline-offset-2 hover:text-foreground transition-colors'
          >
            Contact support
          </a>
          {" · "}
        </p>
      </div>
    </div>
  );
};
