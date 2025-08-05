import EditorIcon from  '../../public/assets/edit.svg';
import VideosIcon from '../../public/assets/videos.svg';
import AssetsIcon from '../../public/assets/Assets.svg';
import CoursesIcon from '../../public/assets/courses.svg';
import SettingsIcon from '../../public/assets/SettingsIcon.svg';
import EditorIconWhite from '../../public/assets/EditorIconWhite.svg';
import VideosIconWhite from '../../public/assets/VideosIconWhite.svg';
import AssetsIconWhite from '../../public/assets/AssetsIconWhite.svg';
import CoursesIconWhite from '../../public/assets/CoursesIconWhite.svg';
import SettingsIconWhite from '../../public/assets/SettingsIconWhite.svg';
import UserIcon from '../../public/assets/user.svg'
import allCourse from '../../public/assets/allCoursesBlack.svg'
import allCourseWhite from '../../public/assets/allCoursesWhite.svg'
import myCourse from '../../public/assets/myCourses.svg'
import myCourseWhite from '../../public/assets/myCoursesWhite.svg'
import puzzleContent from '../../public/assets/puzzleContentBlack.svg'
import puzzleContentWhite from '../../public/assets/puzzleContentWhite.svg'


import { MenuItem } from '../types/lib.types';

export const menuItemsTeachers : MenuItem[] = [
  { label: "Editor", path: "/editor", icon: [EditorIcon, EditorIconWhite] },
  { label: "Assets", path: "/my-assets", icon: [AssetsIcon, AssetsIconWhite]},
  { label: "Videos", path: "/videos", icon: [VideosIcon, VideosIconWhite]},
  { label: "Courses", path: "/courses", icon: [CoursesIcon, CoursesIconWhite]},
  { label: "Settings", path: "/settings", icon: [SettingsIcon, SettingsIconWhite]},
];

export const menuItemsStudents : MenuItem[] = [
  { label: "All Courses", path: "/all-courses", icon: [allCourse, allCourseWhite] },
  { label: "My Courses", path: "/my-courses", icon: [myCourse, myCourseWhite] },
  { label: "Puzzle Content", path: "/puzzle-content", icon: [puzzleContent, puzzleContentWhite] },
  { label: "Settings", path: "/settings", icon: [SettingsIcon, SettingsIconWhite] },
];

export const menuItemsAdmin : MenuItem[] = [ 
  { label: "Admin", path: "/admin", icon: UserIcon },
  { label: "Courses", path: "/courses", icon: CoursesIcon },
  { label: "Settings", path: "/settings", icon: [SettingsIcon, SettingsIconWhite] },
];
