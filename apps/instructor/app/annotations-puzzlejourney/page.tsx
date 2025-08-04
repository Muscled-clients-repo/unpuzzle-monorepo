import AnnotationsPuzzleJourney from "../components/screens/AnnotationsPuzzleJourney/AnnotationsPuzzleJourney";
import { ViewAllCommentProvider } from "../context/ViewAllCommentContext";
const AnnotationsPuzzle = () => {
  return (
    <ViewAllCommentProvider>
      <AnnotationsPuzzleJourney />
    </ViewAllCommentProvider>
  );
};

export default AnnotationsPuzzle;
