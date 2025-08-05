import { useEffect, useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { Progress } from "../../../shared/ui/Progress";
import { Script, ProgressType } from '../../../../types/videoeditor.types'
import '../../../style/style.css'
import LoadingSpinner from '../../Loading'
import AIVoicesPopover from "../AiVoicesPopover";
import WaveSurfaceAudio from "../WavesurferAiScripts";
import Image from "next/image";

export default function Scripts() {
    const [loading, setLoading] = useState<boolean>(true);
    const [scripts, setScripts] = useState<Script[]>([]);
    const [isAddingScript, setIsAddingScript] = useState<boolean>(false);
    const [newScript, setNewScript] = useState<string>('');
    const [progresses, setProgresses] = useState<ProgressType[]>([]);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleAddScriptClick = () => {
        setIsAddingScript(true);
        setTimeout(() => {
            textAreaRef.current && textAreaRef.current.focus();
        }, 0);
    };


    const handleScriptSubmit = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (newScript.trim()) {
                setScripts([...scripts, newScript]);
                setProgresses([...progresses, 0]);
                setNewScript('');
                setIsAddingScript(false);
            }
        }
    };

    const handleScriptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewScript(e.target.value);
    };
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setProgresses((prevProgresses) => {
                return prevProgresses.map((progress) => {
                    if (progress < 100) {
                        return progress + 1; // Increment progress by 1
                    }
                    return progress;
                });
            });
        }, 50); // Adjust the interval for speed of progress

        return () => clearInterval(intervalId);
    }, [scripts]);

    return (
        <div className="bg-white pt-[24px] pb-[30px] rounded-[16px] h-full w-full flex flex-col gap-6">
            {loading ? <div className=' h-fit'> <LoadingSpinner /> </div> : <>

                {scripts.length > 0 ?
                    (

                        <AIVoicesPopover />

                    ) : null}
                {scripts.length > 0 &&
                    <div className='w-full flex gap-6 flex-col max-h-[500px] overflow-y-auto pretty-scrollbar'>


                        {scripts.map((script, index) => (
                            <div key={index} className="flex flex-col gap-6 w-full">
                                <div className='bg-[#F5F4F6] rounded-[10px] px-[16px] py-2 flex flex-col gap-2 w-full'>
                                    <div className='bg-white px-[6px] py-1 rounded-lg text-[6px] text-[#343537] font-medium w-fit'>
                                        {`Video Script ${index + 1}`}
                                    </div>
                                    <p className='text-[#5F6165] leading-normal font-normal text-[14px] truncate-lines break-all'>
                                        {script}
                                    </p>
                                </div>

                                {progresses[index] != 100 &&

                                    <div className="flex flex-col gap-1">

                                        <div className="flex items-center justify-between">
                                            <div className="text-[#515151] text-[10px] font-normal leading-4">
                                                Converting
                                            </div>
                                            <div className="text-[#515151] text-[10px] font-normal leading-4">
                                                {`${progresses[index]}%`}
                                            </div>
                                        </div>
                                        <Progress value={progresses[index]} className="h-1" />
                                    </div>
                                }
                                {/* Show WaveSurfaceAudio only when progress reaches 100% */}
                                {progresses[index] === 100 && <WaveSurfaceAudio />}
                            </div>
                        ))}
                    </div>
                }
                {isAddingScript ? (
                    <div className='border border-[rgba(0,175,240,0.50)] bg-[#F5F4F6] px-2 py-1 rounded-[12px]'>

                        <textarea
                            ref={textAreaRef}
                            className="bg-[#F5F4F6] py-[8px] text-[#55565B] px-[12px] text-[13px] font-normal leading-5  w-full rounded-[10px] border-none focus:outline-none resize-none"
                            value={newScript}
                            onChange={handleScriptChange}
                            onKeyDown={handleScriptSubmit}
                            placeholder="Describe the company in a sentence or two to generate a sitemap..."
                            rows={3}
                        />
                    </div>

                ) : (
                    ""
                )}



                <button
                    className="bg-[#F5F4F6] py-[32px] px-[24px] flex flex-col gap-[8px] items-center rounded-[10px] cursor-pointer"
                    onClick={handleAddScriptClick}
                >
                    <Image src="/assets/black-plus.svg" width='22' height={'22'} alt="" />
                    <p className="text-[rgba(95,97,101,0.20)] font-inter text-[14px] font-semibold">
                        Add Script
                    </p>
                </button>

            </>
            }
        </div>
    )
}