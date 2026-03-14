import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import { useRental } from "@/store";
import { useShallow } from "zustand/shallow";
import { Button, Dialog, DialogContent, DialogTitle } from "@/components";
import { IntentCost } from "@/types";
import { toast } from "sonner";

const frontendBaseUrl =
  process.env.NEXT_PUBLIC_BASE_FRONTEND_URL || "http://localhost:3001";
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PK_KEY || "";
const stripePromise = loadStripe(publishableKey);

const StripeCheckOutComponent = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { intent } = useRental(
    useShallow((state) => ({ intent: state.intent })),
  );

  if (!intent?.paymentIntent.paymentIntent) return null;

  const options = { clientSecret: intent.paymentIntent.paymentIntent };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] rounded-[20px] p-6'>
        <DialogTitle>Complete Payment</DialogTitle>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm onClose={onClose} cost={intent.cost} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export { StripeCheckOutComponent };

const CheckoutForm = ({
  onClose,
  cost,
}: {
  onClose: () => void;
  cost: IntentCost;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    setErrorMsg("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMsg(submitError.message ?? "Submission failed");
      setIsLoading(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${frontendBaseUrl}/rider-db/success`,
      },
    });

    if (result.error) {
      setErrorMsg(result.error.message ?? "Payment failed");
    } else {
      onClose();
      useRental.persist.clearStorage();
      toast.success("Payment successful");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='bg-primaryLight2 rounded-2xl px-4 py-3 flex justify-between items-center'>
        <div className='flex flex-col'>
          <p className='text-xs text-icons'>Base Cost</p>
          <p className='text-xs text-icons'>Pick up Charge</p>
          <p className='text-xs text-icons'>Tax</p>
          <p className='text-sm font-bold mt-1'>Total</p>
        </div>
        <div className='flex flex-col items-end'>
          <p className='text-xs text-icons'>${cost.baseCost.toFixed(2)}</p>
          <p className='text-xs text-icons'>${cost.pickUpCharge.toFixed(2)}</p>
          <p className='text-xs text-icons'>${cost.tax.toFixed(2)}</p>
          <p className='text-sm font-bold mt-1'>${cost.total}</p>
        </div>
      </div>

      <PaymentElement />

      {errorMsg && <p className='text-red-500 text-sm'>{errorMsg}</p>}
      <Button
        type='submit'
        disabled={!stripe || isLoading}
        className='bg-primary text-white rounded-full py-3 font-semibold'
      >
        {isLoading ? "Processing..." : `Pay $${cost.total}`}
      </Button>
    </form>
  );
};
