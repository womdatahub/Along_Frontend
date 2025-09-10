type Props = { label: string; placeholder: string };
export const CustomAuthInput = ({ label, placeholder }: Props) => {
  return (
    <div className='flex flex-col gap-1'>
      <label className='font-semibold text-sm ml-5'>{label}</label>
      <input
        className='bg-white h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder'
        placeholder={placeholder}
      />
    </div>
  );
};
