
import VideoEditorTools from "./VideoEditor/VideoEditorTools";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSocket from "../../hooks/useSocket";
import { RecordingProvider } from "../../context/RecordingContext";
import RecordingIndicator from "../shared/RecordingIndicator";

export default function VideoEditorScreen() {

 
  return (
    <RecordingProvider>
      
        <div className={`video-editor-light w-full h-screen relative overflow-hidden`}>
          <VideoEditorTools />
          <RecordingIndicator />
        </div>
      
    </RecordingProvider>
  );
}
