// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   LoadingSpinner,
//   Separator,
// } from "@/components/";
// // import { useAdmin } from "@/store";
// import { Car, Check, MapPin, Phone, Star } from "lucide-react";
// import Image from "next/image";

// type Props = {
//   trigger: React.ReactNode;
//   isLoading: boolean;
// };
// const DriverInfoModal = ({ trigger, isLoading }: Props) => {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>
//       {isLoading ? (
//         <DialogContent
//           dialogTitle='Loading'
//           className='max-w-sm md:max-w-[840px] min-h-[50vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden flex justify-center items-center'
//         >
//           <LoadingSpinner />
//         </DialogContent>
//       ) : (
//         <DialogContent
//           dialogTitle='Driver details'
//           className='max-w-sm md:max-w-md px-6 py-10'
//         >
//           <div className='flex items-start gap-3 mb-4'>
//             <Image
//               src={
//                 driver.driver.driverProfilePictureUri ??
//                 "/images/placeholder.jpg"
//               }
//               alt={driver.driver.firstName}
//               className='rounded-full size-[120px] object-cover'
//               width={120}
//               height={120}
//             />
//             <div className='flex w-full flex-col gap-5'>
//               <div className='flex flex-col'>
//                 <h2 className='text-2xl font-bold truncate'>
//                   {driver.driver.firstName} {driver.driver.lastName}
//                 </h2>
//                 <p className='text-sm font-semibold mt-0.5'>
//                   CabbageTown, Center Park
//                 </p>
//               </div>

//               <div className='flex gap-3 mt-1'>
//                 <div className='text-xl flex gap-3 items-center justify-center font-bold bg-primary text-white p-3 rounded-[5px]'>
//                   {driver.driver.rating.totalRating}
//                   <Star size={18} className='fill-white text-white' />
//                 </div>

//                 <div className='font-semibold'>
//                   <span className='text-xs '>Rating</span>
//                   <div>
//                     <div className='flex gap-3 items-center'>
//                       <span className='text-xs '>0 Reviews</span>
//                       <div className='flex gap-1 items-center'>
//                         {Array(driver.driver.rating.totalRating)
//                           .fill(0)
//                           .map((_, i) => (
//                             <Star
//                               key={i}
//                               size={12}
//                               className='fill-icons text-icons'
//                             />
//                           ))}
//                         {Array(5 - driver.driver.rating.totalRating)
//                           .fill(0)
//                           .map((_, i) => (
//                             <Star
//                               key={i}
//                               size={12}
//                               className='fill-gray-200 text-icons'
//                             />
//                           ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <span className='flex items-center gap-2 text-sm font-semibold'>
//                 <Phone size={15} className='fill-primary text-primary' />{" "}
//                 {driver.mobileNumber}
//               </span>
//               <div className='flex gap-2 items-center'>
//                 <span className='flex gap-2 text-xs text-gray-500'>
//                   <Car size={18} className='fill-primary text-white' />
//                   <div>
//                     <p className='font-bold text-sm'>0</p>
//                     <p className='text-xs'>Completed rides</p>
//                   </div>
//                 </span>
//                 <Separator
//                   orientation='vertical'
//                   className='h-4 w-2 bg-[#CDD4D4]'
//                 />

//                 <span className='flex gap-2 text-xs text-gray-500'>
//                   <MapPin size={18} className='fill-primary text-white' />
//                   <div>
//                     <p className='font-bold text-sm'>0ml</p>
//                     <p className='text-xs'>Distance shared</p>
//                   </div>
//                 </span>
//               </div>
//             </div>
//           </div>

//           <Separator className='mb-4' />

//           <p className='text-base font-bold mb-'>Registered Vehicle</p>
//           <div className='flex gap-8'>
//             <div className='w-32 h-20 bg-red-500 rounded-lg' />
//             <div className='flex flex-col gap-2'>
//               <div>
//                 <p className='text-xs text-icon'>Car model</p>
//                 <p className='text-sm font-bold'>Tesla Model 3 · 2020</p>
//               </div>
//               <div>
//                 <p className='text-xs text-icon'>Licence</p>
//                 <p className='text-sm font-bold'>LA23 N7NC</p>
//               </div>
//               <div className='flex flex-wrap gap-3'>
//                 <div className='flex gap-1 items-center'>
//                   <div className='size-3 bg-primary'>
//                     <Check size={10} className='text-white fill-white' />
//                   </div>{" "}
//                   <span className='text-xs font-semibold'>4 seats</span>
//                 </div>
//                 <div className='flex gap-1 items-center'>
//                   <div className='size-3 bg-primary'>
//                     <Check size={10} className='text-white fill-white' />
//                   </div>
//                   <span className='text-xs font-semibold'>Air condition</span>
//                 </div>
//                 <div className='flex gap-1 items-center'>
//                   <div className='size-3 bg-primary'>
//                     <Check size={10} className='text-white fill-white' />
//                   </div>{" "}
//                   <span className='text-xs font-semibold'>
//                     Passenger/rear bag
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       )}
//     </Dialog>
//   );
// };
// export { DriverInfoModal };
