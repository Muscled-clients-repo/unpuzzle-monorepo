
import EditorLayout from "./EditorLayout";
import { RecordingProvider } from "../../../context/RecordingContext";
import RecordingStatus from "./RecordingStatus";

export default function EditorContainer() {

 
  return (
    <RecordingProvider>
      <div className={`video-editor-light w-full h-fit relative`}>
        <EditorLayout />
        <RecordingStatus />
      </div>
    </RecordingProvider>
  );
}
