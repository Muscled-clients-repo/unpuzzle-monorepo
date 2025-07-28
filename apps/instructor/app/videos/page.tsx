// "use client";

// import React from "react";
// import Sidebar from "../components/Sidebar";
// import { Provider } from "react-redux";
// import store from "../redux/store";
// import RootLayout from "../ssrComponent/Layout";
// import VideoScreen from "../components/screens/Videos/VideoScreen";

// function Courses() {
//   return (
//     <RootLayout>
//       <VideoScreen />
//     </RootLayout>
//   );
// }

// export default Courses;
// "use client";
import VideoJourney from "../../components/video/VideoScreen/VideoJourney";

export default function Videos() {
  return <VideoJourney />;
  // return <ClientOnly fallback={null}>{() => <VideoJourney />}</ClientOnly>;
}
