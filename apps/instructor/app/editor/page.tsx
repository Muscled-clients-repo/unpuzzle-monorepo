import VideoEditorScreen from "../components/screens/VideoEditorScreen";
import RootLayout from "../ssrComponent/Layout";

export default function Editor() {
  return (
    <div className="py-8 w-full overflow-x-hidden">
      <VideoEditorScreen />
    </div>
  );
}
