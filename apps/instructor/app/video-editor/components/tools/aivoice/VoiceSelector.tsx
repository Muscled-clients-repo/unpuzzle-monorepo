import { useState, useCallback } from "react";
import { Avatar, AvatarFallback } from "../../../../components/ui/Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/Popover";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { Voice } from '../../../../types/videoeditor.types'
import AiWaveSurfacePicker from "./AiWaveSurferBox";
import Image from "next/image";

// Voice configurations for different TTS providers
const getAIVoices = (): Voice[] => {
  const useElevenLabs = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const useOpenAI = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (useElevenLabs) {
    // ElevenLabs voices
    return [
      { id: 1, name: "Rachel", avatarFallback: "R", audioSrc: "/assets/preview-rachel.mp3", voiceId: "21m00Tcm4TlvDq8ikWAM", bgColor: "#FFE4E1", textColor: "#D2691E", gender: "female", accent: "American" },
      { id: 2, name: "Adam", avatarFallback: "A", audioSrc: "/assets/preview-adam.mp3", voiceId: "pNInz6obpgDQGcFmaJgB", bgColor: "#E6E6FA", textColor: "#4B0082", gender: "male", accent: "American" },
      { id: 3, name: "Bella", avatarFallback: "B", audioSrc: "/assets/preview-bella.mp3", voiceId: "EXAVITQu4vr4xnSDxMaL", bgColor: "#FFB6C1", textColor: "#C71585", gender: "female", accent: "American" },
      { id: 4, name: "Josh", avatarFallback: "J", audioSrc: "/assets/preview-josh.mp3", voiceId: "TxGEqnHWrfWFTfGW9XjX", bgColor: "#B0E0E6", textColor: "#000080", gender: "male", accent: "American" },
      { id: 5, name: "Dorothy", avatarFallback: "D", audioSrc: "/assets/preview-dorothy.mp3", voiceId: "ThT5KcBeYPX3keUQqHPh", bgColor: "#DDA0DD", textColor: "#8B008B", gender: "female", accent: "British" },
      { id: 6, name: "Charlie", avatarFallback: "C", audioSrc: "/assets/preview-charlie.mp3", voiceId: "IKne3meq5aSn9XLyUdCD", bgColor: "#98FB98", textColor: "#006400", gender: "male", accent: "Australian" },
    ];
  } else if (useOpenAI) {
    // OpenAI TTS voices
    return [
      { id: 1, name: "Alloy", avatarFallback: "AL", audioSrc: "/assets/preview-alloy.mp3", voiceId: "alloy", bgColor: "#E8F0FE", textColor: "#1976D2", gender: "neutral", accent: "Neutral" },
      { id: 2, name: "Echo", avatarFallback: "EC", audioSrc: "/assets/preview-echo.mp3", voiceId: "echo", bgColor: "#F3E5F5", textColor: "#7B1FA2", gender: "male", accent: "American" },
      { id: 3, name: "Fable", avatarFallback: "FA", audioSrc: "/assets/preview-fable.mp3", voiceId: "fable", bgColor: "#E8F5E9", textColor: "#388E3C", gender: "female", accent: "British" },
      { id: 4, name: "Onyx", avatarFallback: "ON", audioSrc: "/assets/preview-onyx.mp3", voiceId: "onyx", bgColor: "#FFF3E0", textColor: "#E65100", gender: "male", accent: "American" },
      { id: 5, name: "Nova", avatarFallback: "NO", audioSrc: "/assets/preview-nova.mp3", voiceId: "nova", bgColor: "#FCE4EC", textColor: "#C2185B", gender: "female", accent: "American" },
      { id: 6, name: "Shimmer", avatarFallback: "SH", audioSrc: "/assets/preview-shimmer.mp3", voiceId: "shimmer", bgColor: "#E0F2F1", textColor: "#00695C", gender: "female", accent: "American" },
    ];
  } else {
    // Default voices for demo
    return [
      { id: 1, name: "Alex", avatarFallback: "AL", audioSrc: "/assets/tayyabMaleVoice.mp3", voiceId: "alex", bgColor: "#D5CEF7", textColor: "#791A79", gender: "male", accent: "American" },
      { id: 2, name: "Emma", avatarFallback: "EM", audioSrc: "/assets/test2.mp3", voiceId: "emma", bgColor: "#FFE4E1", textColor: "#CD5C5C", gender: "female", accent: "British" },
      { id: 3, name: "Daniel", avatarFallback: "DA", audioSrc: "/assets/test3.mp3", voiceId: "daniel", bgColor: "#E6E6FA", textColor: "#6A5ACD", gender: "male", accent: "American" },
      { id: 4, name: "Sophia", avatarFallback: "SO", audioSrc: "/assets/test4.mp3", voiceId: "sophia", bgColor: "#F0E68C", textColor: "#B8860B", gender: "female", accent: "American" },
    ];
  }
};

const aiVoices: Voice[] = getAIVoices();

interface AIVoicesPopoverProps {
  onVoiceSelect?: (voiceId: string) => void;
}

export default function AIVoicesPopover({ onVoiceSelect }: AIVoicesPopoverProps) {
  // Default to the first voice
  const [selectedVoice, setSelectedVoice] = useState<Voice>(aiVoices[0]);
  const handleVoiceClick = useCallback((voice: Voice) => {
    if (selectedVoice?.id !== voice.id) {
      setSelectedVoice(voice);
      if (onVoiceSelect && voice.voiceId) {
        onVoiceSelect(voice.voiceId);
      }
    }
  }, [selectedVoice, onVoiceSelect]);


  return (
    <Popover>
      <div className="flex gap-2">
        <PopoverTrigger asChild>
          <div className="cursor-pointer flex items-center justify-center text-center gap-[2px] w-[48px] h-[32px] text-[16px] font-normal leading-7 rounded-[8px]" style={{ backgroundColor: selectedVoice?.bgColor, color: selectedVoice?.textColor }}>
            {selectedVoice?.avatarFallback}
          </div>
        </PopoverTrigger>
        <div className="cursor-pointer flex items-center justify-center bg-[#F5F4F6] rounded-[8px] w-full hover:bg-[#1d1d1d] hover:text-white py-2 text-center text-[rgba(29,29,29,0.50)] text-[12px] font-medium leading-normal">
          Convert all scripts into AI voice
        </div>
      </div>
      <PopoverContent className="w-[17rem] p-2 -left-[20px] absolute">
        <ScrollArea className="h-[300px] w-full">
          <div className="grid gap-4 pr-3">
            {aiVoices.map((voice) => (
              <button
                key={voice.id}
                className=""
                onClick={() => handleVoiceClick(voice)}
              >
                {selectedVoice?.id === voice.id ? (
                  <div className="">
                  
                    <AiWaveSurfacePicker audioUrl={selectedVoice?.audioSrc} />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between p-[10px] rounded-[8px] hover:bg-blue-100"

                  >
                    <div className="flex items-center gap-[10px]">
                      <Avatar>
                        <AvatarFallback style={{ backgroundColor: voice.bgColor, color: voice.textColor }}>
                          {voice.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="text-[16px] font-medium leading-normal">
                        {voice.name}
                      </h4>
                    </div>
                    
                    <Image src="/assets/ai-play-picker.svg" alt="Play Icon" />
                    
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}