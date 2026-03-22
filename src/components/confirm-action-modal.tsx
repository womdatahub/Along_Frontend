import {
  Dialog,
  DialogTrigger,
  DialogContent,
  Separator,
  Button,
} from "@/components";
import { cn } from "@/lib";

import { X, MousePointerClick, Power } from "lucide-react";

type IconTypes = "delete" | "suspend" | "reactivate";
const icons: Record<IconTypes, React.ReactNode> = {
  delete: <X className='text-red-500' size={32} />,
  suspend: <MousePointerClick className='text-red-500' size={32} />,
  reactivate: <Power className='text-[#D4D3F0]' size={32} />,
};
type Props = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmActionFunction: () => void;
  type: IconTypes;
};
const ConfirmActionModal = ({
  trigger,
  title,
  description,
  confirmActionFunction,
  type = "delete",
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='max-w-sm overflow-hidden bg-[#E7EDED]'
      >
        <div className='flex flex-col items-center gap-2.5 text-center'>
          <div className={cn('w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center', type==='reactivate' && 'border-[#D4D3F0]')}>
            {icons[type]}{" "}
          </div>
          {/* <div className='flex flex-col gap-1'> */}
          <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
          <p className='text-xs'>{description}</p>
          {/* </div> */}
        </div>
        <Separator className=' bg-[#768B8F38] mt-5' />
        <div className='flex'>
          <Button
            variant='ghost'
            className='flex-1 text-icons  hover:bg-transparent'
          >
            Cancel
          </Button>
          <Separator
            orientation='vertical'
            className='h-12 self-center bg-[#768B8F38]'
          />
          <Button
            variant='ghost'
            className='flex-1 hover:bg-transparent text-red-500 hover:text-red-600'
            onClick={confirmActionFunction}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export { ConfirmActionModal };
