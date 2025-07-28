import ClientSideWrapper from "../components/shared/client-side-wrapper";
import LearningJourneyDetail from "../components/learning/video-learning/learning-journey-detail";

export default function VideoDetail() {
  return (
    <ClientSideWrapper fallback={null}>
      <LearningJourneyDetail videos={[]} />
    </ClientSideWrapper>
  );
}
