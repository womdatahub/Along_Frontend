"use client";

import { FileText, ChevronRight } from "lucide-react";

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
    text: "In the event of disputes, users agree to first attempt informal resolution through customer support. If unresolved, disputes will be submitted to binding arbitration under the rules of the American Arbitration Association (AAA), unless prohibited by applicable federal or state law. Users waive the right to participate in class-action lawsuits to the extent permitted by law.",
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
    text: "These Terms are governed by the laws of the United States and the state of Delaware, without regard to conflict-of-law principles. Any legal claims not subject to arbitration must be brought exclusively in the federal or state courts located in the United States.",
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
              <FileText size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest font-heebo">
                Legal
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black font-heebo leading-tight">
                Terms of Service
              </h1>
            </div>
          </div>
          <p className="text-gray text-sm font-light leading-relaxed max-w-2xl">
            These Terms of Service explain how our ride-hailing platform works,
            your rights and responsibilities, and the rules that govern rider
            and driver use. Last updated: January 2025.
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
                {terms.map((term, i) => (
                  <a
                    key={i}
                    href={`#term-${i}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray hover:text-black hover:bg-background transition-colors duration-150 group"
                  >
                    <ChevronRight
                      size={10}
                      className="text-gray-2 group-hover:text-primary transition-colors shrink-0"
                    />
                    <span className="truncate">{term.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <main className="flex-1 flex flex-col gap-6">
            {terms.map((term, i) => (
              <div
                key={i}
                id={`term-${i}`}
                className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-primary/60 font-heebo tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-bold text-base text-black font-heebo">
                    {term.title}
                  </h2>
                </div>
                <p className="text-sm text-gray font-light leading-relaxed text-justify">
                  {term.text}
                </p>
              </div>
            ))}

            <div className="bg-primaryLight2 rounded-2xl p-6">
              <p className="text-sm font-semibold text-black font-heebo mb-1">
                Questions about these terms?
              </p>
              <p className="text-xs text-gray font-light leading-relaxed">
                Contact our legal team at{" "}
                <a
                  href="mailto:legal@alongcities.com"
                  className="text-primary font-medium hover:text-primary-deep transition-colors"
                >
                  legal@alongcities.com
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
