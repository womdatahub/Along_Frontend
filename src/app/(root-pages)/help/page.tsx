"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  MapPin,
  Car,
  CreditCard,
  Shield,
  User,
  Bell,
  Smartphone,
  Phone,
  Mail,
  MessageSquare,
  Search,
  Clock,
  Star,
  Headphones,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Navigation,
  Key,
  Camera,
} from "lucide-react";

// Types

interface FaqItem {
  question: string;
  answer: string;
}

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  description: string;
  guides: {
    icon: React.ElementType;
    title: string;
    steps: string[];
  }[];
  faqs: FaqItem[];
}

// Content

const sections: Section[] = [
  {
    id: "booking",
    icon: MapPin,
    title: "Booking a Ride",
    color: "bg-blue-50 text-blue-600",
    description:
      "Everything you need to know about requesting and managing rides.",
    guides: [
      {
        icon: Navigation,
        title: "How to book a ride",
        steps: [
          "Open the Along app and sign in to your rider account.",
          "Tap the search bar and enter your destination address.",
          "Confirm your pickup location — drag the map pin to fine-tune.",
          "Choose your ride type: economy, standard, or premium.",
          "Review the fare estimate and tap 'Request Ride'.",
          "Track your driver's arrival in real time on the map.",
          "Meet your driver at the pickup point and verify the car details.",
        ],
      },
      {
        icon: Clock,
        title: "Scheduling a ride in advance",
        steps: [
          "Tap the calendar icon on the ride booking screen.",
          "Select your desired date and time (minimum 30 minutes ahead).",
          "Enter your pickup and drop-off locations.",
          "Confirm the booking — you'll receive a reminder notification.",
          "Your driver will be assigned 15 minutes before pickup time.",
        ],
      },
      {
        icon: AlertCircle,
        title: "Cancelling a ride",
        steps: [
          "Open your active ride in the app.",
          "Tap 'Cancel Ride' at the bottom of the screen.",
          "Select a cancellation reason from the list.",
          "Confirm the cancellation — note that fees may apply if the driver has already departed.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I ride with multiple passengers?",
        answer:
          "Yes. When booking, tap 'Add Passengers' to specify the number of riders. Vehicle capacity varies by ride type — economy seats up to 4, premium up to 6.",
      },
      {
        question: "What if my driver doesn't show up?",
        answer:
          "If your driver hasn't arrived within 5 minutes of the estimated arrival, tap 'Contact Driver'. If there's still no response after 10 minutes, you can cancel for free and a new driver will be matched.",
      },
      {
        question: "Can I add a stop during my trip?",
        answer:
          "Yes. During an active trip, tap the '+' icon on the map screen and enter your additional stop. Fares are automatically recalculated to account for the extra distance and time.",
      },
      {
        question: "How far in advance can I schedule a ride?",
        answer:
          "You can schedule rides up to 7 days in advance. Early scheduling is especially recommended for airport pickups and long-distance intercity trips.",
      },
    ],
  },
  {
    id: "rentals",
    icon: Car,
    title: "Vehicle Rentals",
    color: "bg-green-50 text-green-600",
    description: "Rent a vehicle with or without a driver — on your schedule.",
    guides: [
      {
        icon: Car,
        title: "Renting a vehicle (self-drive)",
        steps: [
          "Go to 'Rent a Vehicle' from the home screen.",
          "Browse available vehicles near you or enter a pickup location.",
          "Filter by vehicle class, price, or available dates.",
          "Select a vehicle and choose your rental duration (hourly or daily).",
          "Review the terms — fuel policy, mileage limits, and deposit amount.",
          "Confirm payment and receive the pickup instructions and access code.",
          "Return the vehicle on time to the agreed location.",
        ],
      },
      {
        icon: User,
        title: "Renting with a driver",
        steps: [
          "Go to 'Rent a Vehicle' and toggle 'With Driver'.",
          "Enter your pickup location and desired start time.",
          "Choose from available drivers — view ratings and vehicle photos.",
          "Select your rental block: 4 hours, 8 hours, or full day.",
          "Confirm booking and receive driver contact details.",
          "Your driver will arrive at your location at the agreed time.",
        ],
      },
    ],
    faqs: [
      {
        question: "What documents do I need to rent a vehicle?",
        answer:
          "For self-drive rentals, you need a valid driver's license and a payment method on file. Your profile must also be verified with a government-issued ID before your first rental.",
      },
      {
        question: "Is there a deposit required?",
        answer:
          "A refundable security deposit is held at the time of booking. The amount varies by vehicle class: economy ($100), standard ($200), premium ($500). It is released within 3–5 business days after return.",
      },
      {
        question: "What happens if I return the vehicle late?",
        answer:
          "Late returns are charged at 1.5× the hourly rate for every hour (or part thereof) over the agreed return time. You will receive a notification 30 minutes before your return deadline.",
      },
      {
        question: "Can I extend a rental while it's active?",
        answer:
          "Yes. Tap 'Extend Rental' in the app during your active booking. Extensions are subject to driver/vehicle availability and must be confirmed before your original end time.",
      },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments & Billing",
    color: "bg-purple-50 text-purple-600",
    description:
      "Manage payment methods, understand charges, and request refunds.",
    guides: [
      {
        icon: CreditCard,
        title: "Adding a payment method",
        steps: [
          "Go to your profile and tap 'Payment Methods'.",
          "Tap 'Add New' and select card, bank transfer, or wallet.",
          "Enter your card details — these are encrypted and never stored by Along directly.",
          "Set the new method as default if desired.",
          "All future rides and rentals will charge to your default method.",
        ],
      },
      {
        icon: CheckCircle,
        title: "Understanding your receipt",
        steps: [
          "After every trip, a receipt is emailed and stored in 'Trip History'.",
          "The receipt shows: base fare, distance charge, time charge, tolls, and any applicable fees.",
          "Rental receipts include: daily/hourly rate, deposit status, fuel adjustment, and late fees if any.",
          "Tap any line item for a detailed breakdown.",
        ],
      },
    ],
    faqs: [
      {
        question: "When am I charged for a ride?",
        answer:
          "Your payment method is charged automatically at the end of each trip. For scheduled rides, a temporary authorization hold is placed at booking and captured at trip completion.",
      },
      {
        question: "How do I get a refund?",
        answer:
          "Refunds for qualifying cancellations are automatically processed within 5–7 business days. For disputed charges, go to 'Trip History', select the trip, and tap 'Report an Issue'. Our team reviews all disputes within 48 hours.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No. Along shows the full estimated fare before you confirm a booking. Tolls, surge pricing, and cancellation fees are clearly disclosed upfront. The only variable is toll costs, which are charged at actual rates.",
      },
      {
        question: "Can I split a fare with others?",
        answer:
          "Fare splitting is available for completed trips. Go to 'Trip History', select the trip, and tap 'Split Fare'. Enter the contact details of the people you'd like to split with — they'll receive a payment request via the app.",
      },
    ],
  },
  {
    id: "driver",
    icon: Key,
    title: "Driving with Along",
    color: "bg-orange-50 text-orange-600",
    description:
      "Start earning by driving — everything from signup to payouts.",
    guides: [
      {
        icon: User,
        title: "Becoming a driver",
        steps: [
          "Create an Along account and select 'Driver' during onboarding.",
          "Fill in your personal details: name, date of birth, emergency contacts.",
          "Upload your profile photo, driver's license (front and back), and an advanced verification selfie.",
          "Enter your Social Security Number for background check processing.",
          "Register your vehicle: make, model, year, color, and VIN.",
          "Upload clear photos of your vehicle (front, interior, rear) and your insurance document.",
          "Select the services you want to offer: rental, scheduled rides.",
          "Connect your Stripe account to receive payouts.",
          "Once approved, toggle your status to 'Available' and start receiving bookings.",
        ],
      },
      {
        icon: Bell,
        title: "Managing availability",
        steps: [
          "From your driver dashboard, set your pickup location using the address search.",
          "Toggle 'Available' to appear to riders and rental customers near you.",
          "Toggle 'Unavailable' when you need a break — you won't receive new requests.",
          "Update your location whenever you move to a new area to get relevant bookings.",
        ],
      },
      {
        icon: Car,
        title: "Listing your vehicle for rental",
        steps: [
          "From your driver dashboard, go to 'List Your Vehicle'.",
          "Set the pickup address where renters can collect the car.",
          "Choose rental modes: 'With Driver' or 'Self-Drive' (if your vehicle qualifies).",
          "Confirm listing — your vehicle becomes visible to renters in the area.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long does driver approval take?",
        answer:
          "Background checks typically complete within 3–5 business days. You'll receive an email and in-app notification once your account is approved. During busy periods, this may extend to 7 business days.",
      },
      {
        question: "When and how do I get paid?",
        answer:
          "Earnings are transferred to your Stripe account weekly every Monday, covering the previous week's completed trips and rentals. You can view your earnings breakdown in real time on the Earnings Overview on your driver dashboard.",
      },
      {
        question: "What vehicles are eligible?",
        answer:
          "Vehicles must be model year 2015 or newer, pass a visual inspection, carry valid insurance, and have no major cosmetic damage. Specific requirements vary by city — check the Driver Requirements page for your market.",
      },
      {
        question: "Can I drive in multiple cities?",
        answer:
          "Yes. Along operates across multiple cities and your account is valid in all of them. Simply update your pickup location when you move to a new area and your listing will reflect the new location.",
      },
    ],
  },
  {
    id: "account",
    icon: User,
    title: "Account & Profile",
    color: "bg-teal-50 text-teal-600",
    description:
      "Manage your personal info, notifications, and account security.",
    guides: [
      {
        icon: User,
        title: "Updating your profile",
        steps: [
          "Go to your dashboard and tap your profile photo or name.",
          "Edit your name, phone number, or email address.",
          "To change your profile photo, tap the camera icon and upload a new image.",
          "Save your changes — some edits may require re-verification for security.",
        ],
      },
      {
        icon: Shield,
        title: "Changing your password",
        steps: [
          "Go to Profile > Security > Change Password.",
          "Enter your current password, then your new password twice.",
          "Passwords must be at least 8 characters and include a number and a symbol.",
          "After saving, you'll be logged out of all other devices automatically.",
        ],
      },
      {
        icon: Camera,
        title: "Verifying your identity",
        steps: [
          "Go to Profile > Identity Verification.",
          "Upload a government-issued photo ID (passport, driver's license, or national ID).",
          "Take a selfie holding the ID as prompted.",
          "Verification typically completes within 24 hours.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I delete my account?",
        answer:
          "Go to Profile > Settings > Delete Account. You'll be asked to confirm. Account deletion is permanent — all trip history, saved addresses, and payment methods will be removed. Outstanding balances must be settled before deletion.",
      },
      {
        question: "What if I forget my password?",
        answer:
          "On the sign-in screen, tap 'Forgot password?' and enter your email address. A reset link will be sent to you within 2 minutes. Check your spam folder if it doesn't arrive.",
      },
      {
        question: "Can I have both a rider and driver account?",
        answer:
          "Your single Along account can function as both. After completing driver onboarding, you can switch between rider and driver modes from your dashboard. No separate login is needed.",
      },
      {
        question: "How do I turn off notifications?",
        answer:
          "Go to Profile > Notifications and toggle individual notification types. You can separately control ride alerts, marketing emails, and SMS messages. Note that safety-related notifications (trip start, OTP) cannot be disabled.",
      },
    ],
  },
  {
    id: "safety",
    icon: Shield,
    title: "Safety",
    color: "bg-red-50 text-red-600",
    description: "Along's safety features and what to do in an emergency.",
    guides: [
      {
        icon: Shield,
        title: "Safety features on every trip",
        steps: [
          "Before entering a vehicle, match the license plate and driver photo in the app.",
          "Share your trip details with a trusted contact by tapping the Share icon.",
          "Use the in-app 'Emergency' button to immediately contact local emergency services.",
          "All trips are GPS-tracked — trip data is stored securely for 90 days.",
          "Rate your driver at the end of every trip to help maintain community standards.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should I do if I feel unsafe during a trip?",
        answer:
          "Tap the 'Emergency' button in the app to call emergency services. You can also ask the driver to stop at a safe public location. After the trip, report the incident through 'Trip History' > 'Report Safety Issue' and our safety team will follow up within 2 hours.",
      },
      {
        question: "How are drivers verified?",
        answer:
          "Every driver undergoes a government ID check, driver's license verification, background check (criminal history and driving record), and vehicle inspection before being approved. Drivers with ratings below 4.2 are reviewed and may be suspended.",
      },
      {
        question: "I left something in a vehicle — what do I do?",
        answer:
          "Go to 'Trip History', select the trip, and tap 'I Lost an Item'. We'll connect you with the driver. If the item is found, the driver will hold it for 24 hours. A small fee may apply for item return coordination.",
      },
    ],
  },
  {
    id: "app",
    icon: Smartphone,
    title: "App & Technical",
    color: "bg-indigo-50 text-indigo-600",
    description:
      "Download the app, troubleshoot issues, and keep things running smoothly.",
    guides: [
      {
        icon: Smartphone,
        title: "Downloading the Along app",
        steps: [
          "Search 'Along Cities' on the App Store (iOS) or Google Play (Android).",
          "Tap 'Install' — the app is free to download.",
          "Open the app and create your account or sign in.",
          "Allow location access when prompted — this is required for ride matching.",
          "Enable notifications to receive real-time updates on your trips.",
        ],
      },
    ],
    faqs: [
      {
        question: "The app isn't loading — what should I try?",
        answer:
          "First, check your internet connection. Then: force-close the app and reopen it. If that doesn't work, clear the app cache (Settings > Apps > Along > Clear Cache on Android; or delete and reinstall on iOS). Make sure you're running the latest app version.",
      },
      {
        question: "Is Along available in my city?",
        answer:
          "Along is expanding rapidly. Check the map on our home page or enter your city in the app's location search to see if service is available. You can also sign up for early access notifications for upcoming cities.",
      },
      {
        question: "My location isn't accurate — how do I fix it?",
        answer:
          "Make sure location permissions are set to 'Always' in your phone settings for the Along app. Enable high-accuracy mode (Settings > Location > High Accuracy on Android). In poor GPS conditions, manually drag the map pin to your exact position.",
      },
    ],
  },
];

// Components

function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-gray-2">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-4 text-left"
          >
            <span className="text-sm font-semibold text-black pr-2">
              {faq.question}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray shrink-0 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-gray font-light leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function GuideCard({
  guide,
}: {
  guide: { icon: React.ElementType; title: string; steps: string[] };
}) {
  const [open, setOpen] = useState(false);
  const Icon = guide.icon;

  return (
    <div className="bg-background rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Icon size={15} className="text-primary" />
          </div>
          <span className="text-sm font-semibold text-black">
            {guide.title}
          </span>
        </div>
        <ChevronDown
          size={15}
          className={`text-gray shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ol className="px-4 pb-4 flex flex-col gap-2.5">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-0.5 size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray font-light leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Page

const Page = () => {
  const [activeSection, setActiveSection] = useState<string>("booking");
  const [searchQuery, setSearchQuery] = useState("");

  const current = sections.find((s) => s.id === activeSection) ?? sections[0];

  const filtered =
    searchQuery.trim().length > 1
      ? sections.flatMap((s) => [
          ...s.faqs
            .filter(
              (f) =>
                f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.answer.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((f) => ({ ...f, sectionTitle: s.title })),
        ])
      : [];

  const isSearching = searchQuery.trim().length > 1;

  return (
    <div className="min-h-screen bg-white font-fustat">
      {/* Hero */}
      <div className="bg-background border-b border-gray-2">
        <div className="max-w-8xl mx-auto px-5 md:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primaryLight2 mb-6">
            <Headphones size={13} className="text-primary" />
            <span className="text-xs font-semibold text-primary">
              Support Center
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-black font-heebo mb-4 leading-tight">
            How can we help you?
          </h1>
          <p className="text-gray text-sm md:text-base font-light max-w-xl mx-auto mb-8">
            Browse guides, step-by-step walkthroughs, and answers to the most
            common questions about Along.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-2xl bg-white border border-gray-2 text-sm font-fustat text-black placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Search results */}
      {isSearching ? (
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
          <p className="text-sm text-gray font-light mb-6">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
            &ldquo;
            <span className="text-black font-medium">{searchQuery}</span>&rdquo;
          </p>
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filtered.map((item, i) => (
                <div key={i} className="bg-background rounded-2xl p-5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    {item.sectionTitle}
                  </p>
                  <p className="text-sm font-semibold text-black mb-2">
                    {item.question}
                  </p>
                  <p className="text-sm text-gray font-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <HelpCircle size={32} className="text-gray-2" />
              <p className="text-sm font-medium text-gray-4">
                No results found
              </p>
              <p className="text-xs text-gray font-light">
                Try different keywords or{" "}
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:text-primary-deep transition-colors"
                >
                  browse all topics
                </button>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === activeSection;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-background text-gray-4 hover:bg-gray-2/60"
                  }`}
                >
                  <Icon size={14} />
                  {s.title}
                </button>
              );
            })}
          </div>

          {/* Active section */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${current.color}`}
              >
                <current.icon size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-black font-heebo">
                  {current.title}
                </h2>
                <p className="text-sm text-gray font-light">
                  {current.description}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Step-by-step guides */}
              <div>
                <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-4">
                  Step-by-step guides
                </p>
                <div className="flex flex-col gap-3">
                  {current.guides.map((guide, i) => (
                    <GuideCard key={i} guide={guide} />
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-4">
                  Frequently asked questions
                </p>
                <div className="bg-background rounded-2xl px-5 py-2">
                  <FaqAccordion faqs={current.faqs} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Contact support */}
      <div className="border-t border-gray-2 bg-background">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest font-heebo mb-3">
              Still need help?
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-black font-heebo mb-3">
              Contact our support team
            </h2>
            <p className="text-gray text-sm font-light max-w-sm mx-auto">
              We&apos;re available 7 days a week. Average first response time is
              under 2 hours.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {contactChannels.map((channel) => (
              <Link
                key={channel.label}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className="flex flex-col gap-3 p-5 bg-white rounded-2xl shadow-sm border border-gray-2 hover:border-primary hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primaryLight2 flex items-center justify-center">
                  <channel.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-black font-heebo">
                    {channel.label}
                  </p>
                  <p className="text-xs text-gray font-light mt-0.5">
                    {channel.sub}
                  </p>
                </div>
                <p className="text-xs font-semibold text-primary group-hover:text-primary-deep transition-colors">
                  {channel.cta}
                </p>
              </Link>
            ))}
          </div>

          {/* Full contact info */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-2">
            <h3 className="font-bold text-base text-black font-heebo mb-6">
              Complete contact information
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
              {fullContactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray font-light">{item.label}</p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        className="text-sm font-semibold text-black hover:text-primary transition-colors"
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold text-black">
                        {item.value}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-xs text-gray font-light mt-0.5">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response times */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {responseTimes.map((item) => (
              <div
                key={item.channel}
                className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-gray-2"
              >
                <div className="size-2 rounded-full bg-green-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-black">
                    {item.channel}
                  </p>
                  <p className="text-xs text-gray font-light">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings callout */}
      <div className="bg-primary-deep text-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-extrabold text-xl font-heebo mb-1">
              Help us improve
            </p>
            <p className="text-white/60 text-sm font-light">
              Rate every trip and share feedback — it directly shapes the Along
              experience for everyone.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={
                  star <= 4
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-white/30"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

// Data

const contactChannels = [
  {
    icon: MessageSquare,
    label: "Live chat",
    sub: "In the app — fastest response",
    cta: "Open chat in app",
    href: "/sign-in",
    external: false,
  },
  {
    icon: Mail,
    label: "Email support",
    sub: "Replies within 24 hours",
    cta: "support@alongcities.com",
    href: "mailto:support@alongcities.com",
    external: false,
  },
  {
    icon: Phone,
    label: "Phone support",
    sub: "Mon–Fri, 8am–8pm EST",
    cta: "+1 (317) 756 8498",
    href: "tel:+13177568498",
    external: false,
  },
  {
    icon: MessageSquare,
    label: "Twitter / X",
    sub: "Quick public responses",
    cta: "@AlongCities",
    href: "https://x.com/alongcities",
    external: true,
  },
];

const fullContactInfo = [
  {
    icon: Mail,
    label: "General support",
    value: "support@alongcities.com",
    href: "mailto:support@alongcities.com",
    note: "Rides, accounts, billing",
    external: false,
  },
  {
    icon: Mail,
    label: "Driver support",
    value: "drivers@alongcities.com",
    href: "mailto:drivers@alongcities.com",
    note: "Earnings, approvals, vehicle issues",
    external: false,
  },
  {
    icon: Mail,
    label: "Safety team",
    value: "safety@alongcities.com",
    href: "mailto:safety@alongcities.com",
    note: "Incidents, reports, urgent issues",
    external: false,
  },
  {
    icon: Mail,
    label: "Privacy & legal",
    value: "legal@alongcities.com",
    href: "mailto:legal@alongcities.com",
    note: "Data requests, compliance",
    external: false,
  },
  {
    icon: Phone,
    label: "Support hotline",
    value: "+1 (317) 756 8498",
    href: "tel:+13177568498",
    note: "Mon–Fri 8am–8pm, Sat 9am–5pm EST",
    external: false,
  },
  {
    icon: Phone,
    label: "Safety emergency line",
    value: "+1 (317) 756 8498",
    href: "tel:+13177568498",
    note: "24/7 — active trips only",
    external: false,
  },
  {
    icon: Bell,
    label: "Instagram",
    value: "@alongcities",
    href: "https://instagram.com/alongcities",
    note: "DMs monitored weekdays",
    external: true,
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Along Inc., New York, NY 10001",
    href: null,
    note: "No walk-in support",
    external: false,
  },
];

const responseTimes = [
  { channel: "Live chat (in-app)", time: "Under 5 minutes" },
  { channel: "Email support", time: "Within 24 hours" },
  { channel: "Phone (business hours)", time: "Under 2 minutes" },
];
