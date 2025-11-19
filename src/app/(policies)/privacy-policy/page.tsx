


"use client";

import { Button } from "@/components";
// import { useRouter } from "next/navigation";
const policies = [
  {
    title: "Introduction",
    text: "This Privacy Policy describes how we collect, use, store, and protect your information when you use our ride-hailing platform. By using the service, you consent to the data practices described here.",
  },
  {
    title: "Information We Collect",
    text: "We collect personal data such as your name, phone number, email, profile details, and identification documents where required. We also collect device information, IP address, app usage logs, and location data to enable ride matching and safety.",
  },
  {
    title: "Location Data",
    text: "We collect precise GPS data when the app is running in the foreground or background. Riders and drivers must enable location access for accurate pickup, navigation, trip tracking, and fraud prevention.",
  },
  {
    title: "Trip Information",
    text: "We record trip details including pickup and drop-off locations, timestamps, route information, distance, price, and driver or rider interactions. This data is used for navigation, support, dispute resolution, and service optimization.",
  },
  {
    title: "Payment Information",
    text: "Payments are processed through secure third-party providers. We receive confirmation of successful payments but do not store full credit or debit card numbers. Billing-related information is retained for accounting and fraud prevention purposes.",
  },
  {
    title: "Communications Data",
    text: "We may collect call logs, chat messages, and support interactions between riders, drivers, and our support channels. Calls may be masked or recorded where allowed by law for safety, training, and dispute resolution.",
  },
  {
    title: "How We Use Your Information",
    text: "We use collected data to operate the service, match riders with drivers, improve performance, provide navigation, ensure safety, detect fraud, process payments, deliver customer support, and develop new features.",
  },
  {
    title: "Sharing of Information",
    text: "We share rider details with drivers only when necessary for completing a trip. We also share limited data with payment processors, law enforcement when legally required, and trusted partners who help us operate the platform. We do not sell your personal data.",
  },
  {
    title: "Data Security",
    text: "We apply industry-standard encryption, access controls, monitoring, and secure storage practices to protect your data. Despite our efforts, no system is completely immune to security breaches.",
  },
  {
    title: "Data Retention",
    text: "We retain account data, trip history, payment logs, and safety-related information for as long as necessary to comply with legal obligations, resolve disputes, prevent fraud, and maintain operational records.",
  },
  {
    title: "Your Rights",
    text: "Depending on your jurisdiction, you may have rights to access, update, delete, or restrict the processing of your personal data. Requests can be submitted through customer support. Some information may be retained for safety and compliance reasons.",
  },
  {
    title: "Cookies and Tracking Technologies",
    text: "We use cookies, device identifiers, and analytics tools to understand app performance, enhance features, and improve user experience. You may disable cookies in your device settings, but certain features may stop working.",
  },
  {
    title: "Third-Party Services",
    text: "Our platform integrates with third-party tools such as maps, payment gateways, analytics providers, and SMS services. These services follow their own privacy policies, and we encourage users to review them.",
  },
  {
    title: "Child Privacy",
    text: "Our service is not intended for minors under 18. We do not knowingly collect information from children. Accounts suspected of being created by minors may be suspended.",
  },
  {
    title: "International Data Transfers",
    text: "Where applicable, your data may be stored or processed in regions outside your country. We ensure appropriate safeguards are in place to protect your information during international transfers.",
  },
  {
    title: "Automated Decision Making",
    text: "We may use automated systems for fraud detection, trip pricing, driver matching, and account risk assessments. These systems help improve safety and efficiency but are monitored for fairness and accuracy.",
  },
  {
    title: "Data Breach Notification",
    text: "In the event of a data breach, we will notify affected users and relevant authorities in accordance with legal requirements and best practices.",
  },
  {
    title: "Changes to This Policy",
    text: "We may revise this Privacy Policy periodically. Significant updates will be communicated through the app. Continued use of the service means you accept the updated policy.",
  },
  {
    title: "Contact Information",
    text: "Users may contact our support team for questions, data requests, or concerns related to privacy, security, or personal data handling.",
  },
];

const Page = () => {
  //   const router = useRouter();
  return (
    <div className="flex flex-col gap-4 w-[500px] aspect-square overflow-y-scroll text-black font-fustat">
      <p className="font-bold text-xl text-center sticky top-0 bg-white pb-2">
        Privacy Policy
      </p>
      <div className="flex flex-col gap-3 text-sm text-justify">
        <p>
          This Privacy Policy explains what data we collect, how we use it, how
          we protect it, and the rights you have regarding your information.
        </p>
        <div className="flex flex-col gap-3">
          {policies.map((policy, i) => {
            return (
              <div key={i} className="flex gap-1 flex-col">
                <p className="font-bold text-lg">{policy.title}</p>
                <p>{policy.text}</p>
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
