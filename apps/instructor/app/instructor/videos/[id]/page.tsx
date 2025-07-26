import ClientOnly from "../../../components/common/ClientOnly";
import VideoJourneyDetail from "../../../components/video/VideoScreen/VideoJourneyDetail";

export default function VideoDetail() {
  return (
    <ClientOnly fallback={null}>
      <VideoJourneyDetail videos={[]} />
    </ClientOnly>
  );
}
