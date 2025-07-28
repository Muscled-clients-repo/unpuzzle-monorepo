import Image from "next/image";
export default function LoadingSpinner() {
    return (
        <div className='flex justify-center items-center flex-col h-full '>
            <Image src="/assets/Spinner@1x-1.0s-200px-200px.svg" alt="Loading spinner" width={80} height={80} />
            <p className='text-[#5F6165] text-[16px] font-medium -mt-4'>Loading</p>
        </div>
    );
}
