import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/Tabs";

import ScriptLibrary from './sidebar/ScriptLibrary';
import MediaLibrary from "./sidebar/MediaLibrary";
import ScriptEditor from "./tools/aivoice/ScriptEditor";
import RecordingPanel from "./recording/RecordingPanel";



interface SidebarTabsProps {
  onAudioGenerated?: (audioClip: any) => void;
  onRecordingComplete?: (videoBlob: Blob, duration: number) => void;
}

export default function SidebarTabs({ onAudioGenerated, onRecordingComplete }: SidebarTabsProps = {}) {
    
    const handleRecordingComplete = (videoBlob: Blob, duration: number) => {
      // Create video clip from recording
      const videoUrl = URL.createObjectURL(videoBlob);
      const videoClip = {
        url: videoUrl,
        start: 0,
        end: duration,
      };
      
      onRecordingComplete?.(videoBlob, duration);
    };

    return (
        <Tabs defaultValue="AI Voice" className={`h-auto w-[100%] transition-transform translate-x-0`}>
            <TabsList className="grid w-full grid-cols-3 gap-1 h-auto bg-white rounded-[12px] p-1">
                <TabsTrigger value="AI Voice" className='text-[rgba(85, 86, 91, 0.50)] TabsTrigger py-[8px] px-[16px] hover:bg-[#00AFF0] hover:text-white text-sm'>
                  AI Voice
                </TabsTrigger>
                <TabsTrigger value="Recording" className='text-[rgba(85, 86, 91, 0.50)] TabsTrigger py-[8px] px-[16px] hover:bg-[#00AFF0] hover:text-white text-sm'>
                  Recording
                </TabsTrigger>
                <TabsTrigger value="Library" className='text-[rgba(85, 86, 91, 0.50)] TabsTrigger py-[8px] px-[16px] hover:bg-[#00AFF0] hover:text-white text-sm'>
                  Library
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="AI Voice" className="h-full overflow-y-auto mt-2">
                <ScriptEditor 
                  onScriptsChange={() => {}}
                  onAudioGenerated={onAudioGenerated || (() => {})}
                />
            </TabsContent>
            
            <TabsContent value="Recording" className="h-full overflow-y-auto mt-2">
                <RecordingPanel
                  onRecordingComplete={handleRecordingComplete}
                  onRecordingStart={() => {}}
                  onRecordingStop={() => {}}
                />
            </TabsContent>
            
            <TabsContent value="Library" className="h-full overflow-y-auto mt-2">
                <MediaLibrary cb={undefined as any} />
            </TabsContent>
        </Tabs>
    );
}
