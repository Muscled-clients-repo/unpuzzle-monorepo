import SettingsIcon from '../../public/assets/SettingsIcon.svg';
import SettingsIconWhite from '../../public/assets/SettingsIconWhite.svg';
import allCourse from '../../public/assets/allCoursesBlack.svg'
import allCourseWhite from '../../public/assets/allCoursesWhite.svg'
import myCourse from '../../public/assets/myCourses.svg'
import myCourseWhite from '../../public/assets/myCoursesWhite.svg'
import puzzleContent from '../../public/assets/puzzleContentBlack.svg'
import puzzleContentWhite from '../../public/assets/puzzleContentWhite.svg'

import { MenuItem } from '../types/lib.types';

export const menuItemsStudents : MenuItem[] = [
  { label: "All Courses", path: "/courses", icon: [allCourse, allCourseWhite] },
  { label: "My Courses", path: "/my-courses", icon: [myCourse, myCourseWhite] },
  { label: "Puzzle Content", path: "/puzzle-content", icon: [puzzleContent, puzzleContentWhite] },
  { label: "Settings", path: "/settings", icon: [SettingsIcon, SettingsIconWhite] },
];
