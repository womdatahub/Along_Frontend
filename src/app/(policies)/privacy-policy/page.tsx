"use client";

import { Shield, ChevronRight } from "lucide-react";

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
    text: "Under applicable U.S. law — including the California Consumer Privacy Act (CCPA) for California residents — you may have the right to know what personal data we collect, request deletion of your data, opt out of certain data sharing, and not be discriminated against for exercising these rights. All users may access, correct, or delete their information by contacting our support team. Some data may be retained as required by law or for safety and fraud-prevention purposes.",
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
    title: "Data Storage and Transfers",
    text: "Your data is primarily stored and processed within the United States. Where necessary for operations, data may be transferred to and stored in other countries. We ensure appropriate contractual and technical safeguards are in place to protect your information in compliance with applicable U.S. law.",
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
  return (
    <div className="min-h-screen bg-background font-fustat">
      {/* Hero */}
      <div className="bg-white border-b border-gray-2">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primaryLight2 flex items-center justify-center">
              <Shield size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest font-heebo">
                Legal
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black font-heebo leading-tight">
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="text-gray text-sm font-light leading-relaxed max-w-2xl">
            This Privacy Policy explains what data we collect, how we use it,
            how we protect it, and the rights you have regarding your
            information. Last updated: January 2025.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of contents */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-4">
                Contents
              </p>
              <nav className="flex flex-col gap-1">
                {policies.map((policy, i) => (
                  <a
                    key={i}
                    href={`#section-${i}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray hover:text-black hover:bg-background transition-colors duration-150 group"
                  >
                    <ChevronRight
                      size={10}
                      className="text-gray-2 group-hover:text-primary transition-colors shrink-0"
                    />
                    <span className="truncate">{policy.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <main className="flex-1 flex flex-col gap-6">
            {policies.map((policy, i) => (
              <div
                key={i}
                id={`section-${i}`}
                className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-primary/60 font-heebo tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-bold text-base text-black font-heebo">
                    {policy.title}
                  </h2>
                </div>
                <p className="text-sm text-gray font-light leading-relaxed text-justify">
                  {policy.text}
                </p>
              </div>
            ))}

            <div className="bg-primaryLight2 rounded-2xl p-6">
              <p className="text-sm font-semibold text-black font-heebo mb-1">
                Questions about this policy?
              </p>
              <p className="text-xs text-gray font-light leading-relaxed">
                Contact our privacy team at{" "}
                <a
                  href="mailto:privacy@alongcities.com"
                  className="text-primary font-medium hover:text-primary-deep transition-colors"
                >
                  privacy@alongcities.com
                </a>{" "}
                — we typically respond within 48 hours.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default Page;
