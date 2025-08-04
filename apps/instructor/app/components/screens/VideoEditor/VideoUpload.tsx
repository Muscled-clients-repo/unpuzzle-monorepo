import { Dialog, DialogContent, DialogTrigger } from "../../ui/Dialog";
import plusBlueIcon from '../../assets/blue-plus.svg';

export default function VideoUpload(){

    return (
        <div>
        <Dialog>
        <DialogTrigger asChild>
            <div className="cursor-pointer" tabIndex={0} role="button">
                <img src={plusBlueIcon} alt='Plus Icon' />
            </div>
        </DialogTrigger>
        <DialogContent className='sm:max-w-xl'>
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-[6px] justify-center items-center w-[315px] mx-auto'>
                <h1 className='text-[#1D1D1D] font-bold text-[18px] leading-normal'>Record a video for course</h1>
            </div>
            <div className="flex flex-col px-5 py-8 border border-dotted justify-center gap-[24px] items-center rounded-[10px]">

                <div className="cursor-pointer" tabIndex={0} role="button">
                    <img src={plusBlueIcon} alt='Plus Icon' />
                </div>
                <div>
                    <p className="text-[#1d1d1d] font-inter text-[16px] font-semibold leading-normal text-center">
                        Start recording
                    </p>
                    <p className="text-[#5F6165] font-inter text-[14px] font-normal leading-normal text-center">
                        Your video will be private until you publish your profile
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className=" w-[97px] font-semibold text-[10px] p-[10px] border border-[rgba(29,29,29,0.10)] rounded-[8px] text-[#000] leading-normal hover:bg-[rgba(245,244,246,0.80)]">
                        Start Recording
                    </button>
                </div>
            </div>
        </div>
        </DialogContent>
    </Dialog>
    </div>


    )
} 