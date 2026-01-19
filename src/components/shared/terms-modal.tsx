"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  Button,
  DialogFooter,
} from "@/components";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  isTermsModalOpen: boolean;
  setIsTermsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: React.ReactNode;
  acceptFunction: () => void;
};
const TermsModal = ({
  trigger,
  isTermsModalOpen,
  setIsTermsModalOpen,
  acceptFunction,
}: Props) => {
  return (
    <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='sm:max-w-[700px] max-h-[75%] overflow-y-scroll px-10 py-8 rounded-[20px] bg-background-1'
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Terms and conditions</DialogTitle>
        </VisuallyHidden>
        <DialogTitle className='font-semibold text-2xl'>
          Terms and Conditions
        </DialogTitle>
        <div className='flex flex-col gap-5 text-semibold text-sm'>
          <p>
            Welcome to Along Ride Sharing Services LLC (“Along,” “we,” “us,” or
            “our”). These Rider Terms and Conditions (“Terms”) govern your use
            of our platform and services as a rider (“Rider,” “you,” or “your”).
            By registering and booking rides through Along, you agree to comply
            with these Terms.{" "}
          </p>
          <div className='flex flex-col gap-1'>
            {terms.map((term, id) => {
              return (
                <div key={id} className='flex gap-2'>
                  <p>{id + 1}.</p>
                  <p>{term}</p>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={acceptFunction}>Accept</Button>
            <Button
              variant='destructive'
              onClick={() => setIsTermsModalOpen(false)}
            >
              Decline
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export { TermsModal };
const terms = [
  "Rider Eligibility and Registration You must be at least 18 years old to use our services. You agree to provide accurate, complete, and up-to-date information during registration and booking. You are responsible for maintaining the confidentiality of your account credentials.",
  "Booking and Use of Services You may use the Along platform to request rides from registered drivers. Ride availability depends on driver presence and route compatibility. You agree to provide accurate pickup and drop-off locations. You must be ready at the agreed pickup time and location. Along reserves the right to cancel or modify bookings as necessary.",
  "Rider Conduct You agree to treat drivers and other riders with respect and courtesy. Discrimination, harassment, or abusive behavior is strictly prohibited. Smoking, alcohol, or drug use during rides is not allowed. You are responsible for your personal belongings during rides. Along is not liable for lost or damaged items",
  "Payments and Fees Ride fares will be displayed at booking and are subject to change based on distance, time, and demand. Payment must be made through the Along platform using accepted payment methods. Tips are optional and go 100% to the driver. You agree to pay all applicable fees and taxes. Refunds or disputes will be handled according to Along’s policies",
  "Safety and Liability Along conducts background checks and vehicle inspections for drivers but does not guarantee safety. You must follow driver instructions and safety guidelines during rides. Along is not liable for any injuries, damages, or losses incurred during rides. In case of emergencies or safety concerns, contact Along support immediately. ",
];
