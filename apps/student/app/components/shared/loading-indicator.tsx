import loadingSpinner from '../../../public/assets/Spinner@1x-1.0s-200px-200px.svg';
import Image from "next/image";

export default function LoadingSpinner() {
    return (
        <div className='flex justify-center items-center flex-col h-full '>
            <Image src="" alt="Loading spinner" fill className="w-20 h-20" />
            <p className='text-[#5F6165] text-[16px] font-medium -mt-4'>Loading</p>
        </div>
    );
}
