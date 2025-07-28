import StudentAnnotationsViewer from "../components/learning/annotations/student-annotations-viewer";
import { ViewAllCommentProvider } from "../context/ViewAllCommentContext";
const AnnotationsPuzzle = () => {
  return (
    <ViewAllCommentProvider>
      <StudentAnnotationsViewer />
    </ViewAllCommentProvider>
  );
};

export default AnnotationsPuzzle;
