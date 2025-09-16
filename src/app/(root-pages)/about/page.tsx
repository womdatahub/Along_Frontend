import { HeadingHeebo } from "@/components";
import Image from "next/image";

const page = () => {
  return (
    <div className='font-fustat'>
      <section className='pt-[272px] px-6 text-center bg-background-1 h-[844px]'>
        <div className='flex gap-20 max-w-6xl mx-auto items-center justify-between'>
          <div className='flex flex-col gap-10 w-1/2'>
            <HeadingHeebo className='font-extrabold text-[67px] text-left'>
              About Us
            </HeadingHeebo>
            <p className='font-heebo font-light text-lg text-left'>
              At Along, we care about bridging the gap between smaller towns,
              suburbs, and major cities by connecting local residents with
              drivers already traveling those routes. For communities without
              access to robust public transportation or airports, Along creates
              a reliable, convenient, and affordable way to move across cities
              and regions. Beyond shared rides, we make mobility even simpler
              with Along Rentals—customers can book professional drivers with
              vehicles on an hourly, daily, or longer basis, giving them the
              freedom to travel on their own schedule.
            </p>
          </div>
          <div className='flex w-1/2 relative'>
            <Image
              src='/images/about-woman-bg.png'
              alt='woman-bg'
              width={600}
              height={600}
              className='z-10 object-contain'
            />
            <Image
              src='/images/about-woman.png'
              alt='woman'
              width={490}
              height={700}
              className='z-20 absolute w-[490px] h-[700px] object-contain -top-32'
            />
          </div>
        </div>
      </section>
      <section className='py-36 px-6 text-center bg-gradient-to-b from-[#8DC13D] via-[#026270] to-[#0E4A7A]'>
        <div className='flex flex-col gap-32 max-w-6xl mx-auto items-center justify-between'>
          <div className='flex gap-20 items-center text-white justify-between'>
            <div className='flex flex-col gap-1 w-1/2'>
              <HeadingHeebo className='text-left text-[40px]'>
                Our Mission
              </HeadingHeebo>
              <p className='text-left font-light text-lg'>
                Our mission is to provide safe, customizable, and cost-effective
                intercity travel solutions across the United States and
                worldwide. Whether you’re planning ahead or need a last-minute
                ride, Along is your trusted partner for flexible, comfortable,
                and secure travel — all at your fingertips.
              </p>
            </div>
            <Image
              src='/images/mission.png'
              alt='mission'
              width={422}
              height={535}
              className='object-contain w-[422px] h-[535px]'
            />
          </div>
          <div className='flex gap-20 items-center text-white justify-between'>
            <Image
              src='/images/vision.png'
              alt='mission'
              width={422}
              height={535}
              className='object-contain w-[422px] h-[535px]'
            />
            <div className='flex flex-col gap-1 w-1/2'>
              <HeadingHeebo className='text-left text-[40px]'>
                Our Vision
              </HeadingHeebo>
              <p className='text-left  font-light text-lg'>
                To shape the future of mobility in the U.S. — one that’s
                eco-friendly, inclusive, and tailored to the needs of both
                individuals and communities.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className='py-36 px-6 bg-background-1'>
        <div className='flex flex-col gap-32 max-w-6xl mx-auto items-center justify-between'>
          <HeadingHeebo className='text-[40px] font-extrabold'>
            What makes us different
          </HeadingHeebo>
          <div className='flex gap-20 items-center justify-between'>
            <Image
              src='/images/what-makes-us-different.png'
              alt='mission'
              width={496}
              height={496}
              className='object-contain w-[496px] aspect-square'
            />
            <div className='flex flex-col gap-1 w-1/2'>
              <HeadingHeebo className='text-left text-lg'>
                Inclusive Services
              </HeadingHeebo>
              <p className='text-left  font-light text-lg w-2/3'>
                We don’t just focus on rides; we also offer logistics, package
                delivery, and rental options.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default page;
