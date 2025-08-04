import ClientOnly from "../components/shared/ClientOnly";
import VideoJourneyDetail from "../components/screens/VideoScreen/VideoJourneyDetail";

export default function VideoDetail() {
  return (
    <ClientOnly fallback={null}>
      <VideoJourneyDetail videos={[]} />
    </ClientOnly>
  );
}
