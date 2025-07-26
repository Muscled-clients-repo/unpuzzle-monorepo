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


import { MenuItem } from '../types/lib.types';

// Instructor menu items for the instructor-only application
export const menuItems : MenuItem[] = [
  { label: "Editor", path: "/instructor/video-editor", icon: [EditorIcon, EditorIconWhite] },
  { label: "Assets", path: "/instructor/assets", icon: [AssetsIcon, AssetsIconWhite]},
  { label: "Videos", path: "/instructor/videos", icon: [VideosIcon, VideosIconWhite]},
  { label: "Courses", path: "/instructor/courses", icon: [CoursesIcon, CoursesIconWhite]},
  { label: "Settings", path: "/instructor/settings", icon: [SettingsIcon, SettingsIconWhite]},
];

// Legacy export for backward compatibility (remove after updating all imports)
export const menuItemsTeachers = menuItems;