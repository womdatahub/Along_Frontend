type Props = { text?: string };
const LoadingComponent = ({ text }: Props) => {
  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <div className='flex flex-col items-center space-y-3'>
        <div className='size-10 rounded-full bg-primary' />
        <p className='text-sm animate-pulse'>Loading {text}...</p>
      </div>
    </div>
  );
};
export { LoadingComponent };
