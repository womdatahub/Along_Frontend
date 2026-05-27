"use client";

import { AddInput, AddTextarea, Button } from "@/components";
import { THearFromYouValidator, hearFromYouSchema } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Globe,
  Shield,
  Users,
} from "lucide-react";

const Page = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<THearFromYouValidator>({
    defaultValues: {
      email: "",
      fullName: "",
      mobileNumber: "",
      yourMessage: "",
    },
    resolver: zodResolver(hearFromYouSchema),
  });

  const onSubmit = async () => {
    toast.success("Thanks. The Along team will review your message.");
    reset();
  };

  return (
    <div className="font-fustat bg-white">
      {/* Hero section */}
      <section className="px-5 md:px-8 pt-8 pb-0 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex flex-col gap-6 md:w-1/2 pb-12">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 font-heebo">
                  Our Story
                </p>
                <h1 className="font-extrabold text-4xl md:text-6xl text-black font-heebo leading-tight mb-6">
                  Connecting cities,
                  <br />
                  <span className="text-primary">one ride at a time</span>
                </h1>
                <p className="font-light text-base md:text-lg text-gray leading-relaxed max-w-lg">
                  At Along, we bridge the gap between smaller towns, suburbs,
                  and major cities — connecting local residents with drivers
                  already traveling those routes. For communities without robust
                  public transit, Along creates a reliable, convenient, and
                  affordable way to move across cities and regions.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Globe, label: "50+ Cities" },
                  { icon: Users, label: "10k+ Riders" },
                  { icon: Shield, label: "Verified Drivers" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-sm border border-gray-2"
                  >
                    <Icon size={14} className="text-primary" />
                    <span className="text-xs font-semibold text-black">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:w-[45%] flex justify-end">
              <Image
                src="/images/about-us-woman.png"
                alt="Along rider"
                width={560}
                height={680}
                className="object-contain w-full max-h-130 md:max-h-150"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-5 md:px-8 bg-linear-to-b from-primary via-[#026270] to-[#0E4A7A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-20">
            {/* Mission */}
            <div className="flex flex-col md:flex-row gap-12 md:items-center justify-between">
              <div className="flex flex-col gap-4 md:w-1/2 text-white">
                <p className="text-white/60 text-sm font-semibold uppercase tracking-widest font-heebo">
                  Our Purpose
                </p>
                <h2 className="font-extrabold text-3xl md:text-5xl font-heebo leading-tight">
                  Our Mission
                </h2>
                <p className="font-light text-base md:text-lg leading-relaxed text-white/80">
                  To provide safe, customizable, and cost-effective intercity
                  travel solutions across the United States and worldwide.
                  Whether you&apos;re planning ahead or need a last-minute ride,
                  Along is your trusted partner for flexible, comfortable, and
                  secure travel — all at your fingertips.
                </p>
              </div>
              <div className="md:w-[42%]">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/about-mission.png"
                    alt="Our mission"
                    width={560}
                    height={400}
                    className="object-cover w-full h-64 md:h-80"
                  />
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="flex flex-col-reverse md:flex-row gap-12 md:items-center justify-between">
              <div className="md:w-[42%]">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/about-vision.png"
                    alt="Our vision"
                    width={560}
                    height={400}
                    className="object-cover w-full h-64 md:h-80"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 md:w-1/2 text-white">
                <p className="text-white/60 text-sm font-semibold uppercase tracking-widest font-heebo">
                  Looking Ahead
                </p>
                <h2 className="font-extrabold text-3xl md:text-5xl font-heebo leading-tight">
                  Our Vision
                </h2>
                <p className="font-light text-base md:text-lg leading-relaxed text-white/80">
                  To shape the future of mobility in the U.S. — one that&apos;s
                  eco-friendly, inclusive, and tailored to the needs of both
                  individuals and communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section
        className="relative text-white flex items-center justify-center py-32 px-5 md:px-8"
        style={{
          backgroundImage: "url('/images/what-makes-us.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest font-heebo mb-4">
              Our Edge
            </p>
            <h2 className="font-extrabold text-3xl md:text-5xl font-heebo leading-tight mb-10">
              What makes us different
            </h2>
            <div className="flex flex-col gap-6">
              {differentiators.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-base font-heebo mb-1">
                      {item.title}
                    </p>
                    <p className="text-white/70 font-light text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-5 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 md:items-start justify-between">
            <div className="md:w-2/5">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 font-heebo">
                Get in Touch
              </p>
              <h2 className="font-extrabold text-3xl md:text-5xl text-black font-heebo leading-tight mb-6">
                Have a question?
              </h2>
              <p className="text-gray font-light text-base leading-relaxed mb-8">
                We&apos;d love to hear from you. Fill out the form and our team
                will get back to you within 24 hours.
              </p>
              <div className="flex flex-col gap-4">
                {contactMethods.map((method) => (
                  <div key={method.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      <method.icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray font-light">
                        {method.label}
                      </p>
                      <p className="text-sm font-semibold text-black">
                        {method.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:w-1/2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 bg-white rounded-3xl p-6 md:p-8 shadow-sm"
              >
                <AddInput
                  id="fullName"
                  errors={errors}
                  placeholder="Your full name"
                  register={register}
                  disabled={false}
                  required
                  type="text"
                  iconAndInputWrapperClassName="bg-background rounded-2xl h-14 px-2"
                  inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                  label="Full Name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <AddInput
                    id="mobileNumber"
                    errors={errors}
                    placeholder="+1 000 000 0000"
                    register={register}
                    disabled={false}
                    required
                    type="text"
                    iconAndInputWrapperClassName="bg-background rounded-2xl h-14 px-2"
                    inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                    label="Phone"
                  />
                  <AddInput
                    id="email"
                    errors={errors}
                    placeholder="you@example.com"
                    register={register}
                    disabled={false}
                    required
                    type="text"
                    iconAndInputWrapperClassName="bg-background rounded-2xl h-14 px-2"
                    inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                    label="Email"
                  />
                </div>
                <AddTextarea
                  id="yourMessage"
                  errors={errors}
                  placeholder="Tell us how we can help..."
                  register={register}
                  disabled={false}
                  required
                  type="text"
                  iconAndInputWrapperClassName="bg-background rounded-2xl px-2"
                  inputClassName="placeholder:text-placeholder text-sm h-28 font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
                  label="Message"
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-deep rounded-2xl h-14 w-full text-white text-sm font-semibold transition-colors duration-200 gap-2"
                >
                  <Send size={16} />
                  Send message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Page;

const differentiators = [
  {
    icon: Globe,
    title: "Inclusive Services",
    desc: "We don't just focus on rides — we also offer logistics, package delivery, and flexible rental options.",
  },
  {
    icon: Shield,
    title: "Safety First",
    desc: "Every driver is verified, every trip is tracked, and your safety is always our top priority.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    desc: "Built for the communities others ignore — smaller towns, suburbs, and underserved routes.",
  },
];

const contactMethods = [
  { icon: Mail, label: "Email us", value: "info@alongcities.com" },
  { icon: Phone, label: "Call us", value: "+1 (317) 756 8498" },
  { icon: MessageSquare, label: "Live chat", value: "Available in the app" },
];
