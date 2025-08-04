import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../components/shared/ui/Tabs";

import AiScriptsTabs from './VideoEditorTabs/AiScriptsTabs';
import Library from "./VideoEditorTabs/EditorLibraryTabs";
import ScriptEditor from "./AIVoice/ScriptEditor";
import RecordingControls from "./Recording/RecordingControls";



interface VideoEditorTabsProps {
  onAudioGenerated?: (audioClip: any) => void;
  onRecordingComplete?: (videoBlob: Blob, duration: number) => void;
}

export default function VideoEditorTabs({ onAudioGenerated, onRecordingComplete }: VideoEditorTabsProps = {}) {
    
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
            
            <TabsContent value="AI Voice" className="h-[400px] mt-2">
                <ScriptEditor 
                  onScriptsChange={() => {}}
                  onAudioGenerated={onAudioGenerated || (() => {})}
                />
            </TabsContent>
            
            <TabsContent value="Recording" className="h-[400px] mt-2">
                <RecordingControls
                  onRecordingComplete={handleRecordingComplete}
                  onRecordingStart={() => {}}
                  onRecordingStop={() => {}}
                />
            </TabsContent>
            
            <TabsContent value="Library" className="h-[400px] mt-2">
                <Library />
            </TabsContent>
        </Tabs>
    );
}
