"use client";

import { Button } from "@/components";
// import { useRouter } from "next/navigation";
const terms = [
  {
    title: "Acceptance of Terms",
    text: "By creating an account, accessing the platform, or using any service we provide, you agree to be legally bound by these Terms. If you do not agree, you must stop using the platform immediately.",
  },
  {
    title: "Service Overview",
    text: "We operate a technology platform that connects riders with independent drivers for transportation services. We do not own vehicles, employ drivers, or provide transportation ourselves. Drivers are independent contractors responsible for their own vehicles, licenses, and compliance with road laws.",
  },
  {
    title: "Account Registration",
    text: "To use the service, you must create an account with accurate personal information. You are responsible for maintaining confidentiality of your login credentials and all activities under your account. We may suspend or disable accounts that use false information or violate these Terms.",
  },
  {
    title: "Eligibility",
    text: "You must be at least 18 years old and legally capable of entering into a binding contract. Drivers must meet all licensing, insurance, and vehicle requirements applicable in their jurisdiction.",
  },
  {
    title: "User Conduct",
    text: "You agree not to misuse the platform. This includes harassment, abuse, fraud, fare evasion, damage to vehicles, or interference with driver navigation. Riders must behave respectfully and comply with road safety standards and driver instructions.",
  },
  {
    title: "Driver Conduct",
    text: "Drivers must maintain safe, roadworthy vehicles, follow all traffic regulations, uphold professional conduct, and ensure the safety of riders. Drivers may be suspended or removed for unsafe behavior, misconduct, or violation of legal requirements.",
  },
  {
    title: "Location and Trip Data",
    text: "Accurate location data is required for matching riders and drivers. By using the service, you consent to the collection and use of GPS location data for navigation, safety, trip tracking, and fraud prevention.",
  },
  {
    title: "Payments and Charges",
    text: "By requesting a ride, you authorize us to charge your selected payment method for fares, tolls, taxes, cancellation fees, and other applicable charges. Fares may vary based on distance, time, traffic, and demand. All payments are processed by third-party providers, and fees are non-refundable except where required by law.",
  },
  {
    title: "Cancellations and Fees",
    text: "Riders may cancel a trip before a driver arrives, but cancellation fees may apply based on timing. Drivers may also cancel trips for safety or compliance reasons. Repeated misuse may result in account restrictions.",
  },
  {
    title: "Ratings and Feedback",
    text: "Riders and drivers may rate each other to maintain service quality. We may use these ratings to restrict or remove accounts that consistently fall below quality standards or violate safety expectations.",
  },
  {
    title: "Safety and Emergencies",
    text: "We provide safety tools, real-time trip monitoring, and emergency features where available. However, we do not guarantee absolute safety. Users should exercise caution, verify vehicle details, and follow safety guidelines.",
  },
  {
    title: "Independent Contractor Status",
    text: "Drivers are not employees, agents, or representatives of the platform. They operate independently and control their own schedules, vehicle maintenance, and work conditions. We are not responsible for driver actions or omissions.",
  },
  {
    title: "Platform Availability",
    text: "We strive to maintain reliable service but do not guarantee uninterrupted access. Maintenance, technical failures, or external factors may affect availability. We may modify or discontinue features at any time.",
  },
  {
    title: "Limitations of Liability",
    text: "The platform is provided 'as is' without warranties. We are not liable for accidents, personal injury, delays, loss of property, or damages arising from driver behavior, user actions, or external factors, except where prohibited by law.",
  },
  {
    title: "Dispute Resolution",
    text: "In the event of disputes, users agree to first attempt informal resolution through customer support. We may require arbitration or mediation depending on local laws. Users waive the right to participate in class-action lawsuits where permitted.",
  },
  {
    title: "Account Suspension or Termination",
    text: "We may suspend or terminate accounts for violations of these Terms, unsafe conduct, fraud, or failure to meet driver requirements. Users may also delete their accounts at any time, but outstanding charges will remain due.",
  },
  {
    title: "Privacy and Data Use",
    text: "We collect and use personal data as described in our Privacy Policy. By using the service, you consent to the processing of your information for safety, operations, payments, and improvement of the platform.",
  },
  {
    title: "Changes to the Terms",
    text: "We may update these Terms periodically. Significant changes will be communicated through the platform. Continued use after updates constitutes acceptance of the revised Terms.",
  },
  {
    title: "Governing Law",
    text: "These Terms are governed by the laws of the jurisdiction in which the service operates. Any legal claims must be brought in the appropriate local courts unless arbitration is required.",
  },
];

const Page = () => {
  //   const router = useRouter();
  return (
    <div className="flex flex-col gap-4 w-[500px] aspect-square overflow-y-scroll text-black font-fustat">
      <p className="font-bold text-xl text-center sticky top-0 bg-white pb-2">
        Terms Of Service
      </p>
      <div className="flex flex-col gap-3 text-sm text-justify">
        <p>
          These Terms of Service explain how our ride-hailing platform works,
          your rights and responsibilities, and the rules that govern rider and
          driver use.
        </p>
        <div className="flex flex-col gap-3">
          {terms.map((term, i) => {
            return (
              <div key={i} className="flex gap-1 flex-col">
                <p className="font-bold text-lg">{term.title}</p>
                <p>{term.text}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex self-end">
        {/* <Button
          variant="link"
          className="text-black font-bold hover:cursor-pointer"
          //   onClick={() => router.back()}
        >
          Back
        </Button> */}
        <Button
          variant="link"
          className="text-primary font-bold hover:cursor-pointer"
          //   onClick={() => router.push("/onboarding/services")}
        >
          Accept
        </Button>
      </div>
    </div>
  );
};
export default Page;
