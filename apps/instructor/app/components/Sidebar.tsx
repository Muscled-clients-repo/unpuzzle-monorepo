import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  menuItemsTeachers,
  menuItemsStudents,
  menuItemsAdmin,
} from "../lib/menu-list";
import { useDispatch, useSelector } from "react-redux";
import {
  showSidebar,
  hideSidebar,
  togglePersistent,
} from "../redux/features/sidebarSlice/sidebarSlice";
import { SidebarProps } from "../types/layout.types";
import { RootState } from "../redux/store";
import { MenuItem } from "../types/lib.types";
import { togglePopover } from "../redux/features/recording/recordingSlice";
import Image from "next/image";
import ScreenRecording from "../components/screens/ScreenRecording";
import { useClerkUser } from "../hooks/useClerkUser";
// import { useSignOut } from "@clerk/nextjs";

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const dispatch = useDispatch();
  const { persistent, isVisible } = useSelector(
    (state: RootState) => state.sidebar
  );
  // const { signOut } = useSignOut();

  // const userRules = user?.publicMetadata?.privileges || 'student'
  // const userRules:string = 'student'
  const userRules: string = "teacher";

  const menuItems: MenuItem[] =
    userRules == "admin"
      ? menuItemsAdmin
      : userRules == "teacher"
      ? menuItemsTeachers
      : menuItemsStudents;
  const topItems = menuItems.slice(0, -1);
  const bottomItems = menuItems.slice(-1);

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!persistent) {
        dispatch(hideSidebar());
      }
    }, 100); // Adjust delay as needed
  };

  return (
    <div className="max-w-[15%] py-[30px] pl-[15px] px-2 text-[#5F6165] h-full border-r border-r-[#F3F5F8] flex flex-col items-center justify-between">
      <div>
        <div className="mb-[25px] w-full flex items-center justify-center">
          <Link href={userRules === "student" ? "/all-courses" : "/editor"}>
            <Image width={64} height={64} src="/assets/logo.svg" alt="Logo" />
          </Link>
        </div>
        <ul
          className="space-y-[10px]"
          onMouseEnter={() => dispatch(showSidebar())}
          onMouseLeave={handleMouseLeave}
        >
          {topItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <div className="flex flex-row items-center justify-center relative cursor-pointer">
                  {item.path ? (
                    <Link
                      href={item.path}
                      className={`flex flex-col items-center justify-center w-[80px] h-[70px] gap-[10px] px-[8px] py-[7px] rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-[#00AFF0] text-[#FFFFFF]"
                          : "hover:bg-[#F3F5F8] text-[#1D1D1D]"
                      }`}
                    >
                      <Image
                        height={22}
                        width={22}
                        src={isActive ? item.icon[1] : item.icon[0]}
                        alt={`${item.label} icon`}
                      />
                      <p className="text-sm text-center">{item.label}</p>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        if (item.action === "toggleRecording") {
                          dispatch(togglePopover()); // Handle the custom action
                        }
                      }}
                      className="flex flex-col items-center justify-center w-[80px] h-[70px] gap-[10px] px-[8px] py-[7px] rounded-md text-sm font-medium hover:bg-[#F3F5F8] text-[#1D1D1D]"
                    >
                      <Image
                        height={22}
                        width={22}
                        src={item.icon[0]}
                        alt={`${item.label} icon`}
                      />
                      <p className="text-sm">{item.label}</p>
                    </button>
                  )}
                  {item.path === pathname &&
                  (item.path === "/editor" || item.path === "/assets") ? (
                    <button
                      onClick={() => dispatch(togglePersistent())}
                      className={`h-[30px] w-[30px] rounded-full absolute z-40 transition-all duration-300 ${
                        isVisible
                          ? "-right-7 opacity-100"
                          : "right-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src="/assets/angle-right.svg"
                        width={30}
                        height={30}
                        className="z-60"
                        alt="Right Arrow"
                      />
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
          {/* Recording component */}
          {userRules === "teacher" && (
            <li>
              <div className="flex flex-row items-center justify-center relative">
                <ScreenRecording />
              </div>
            </li>
          )}
        </ul>
      </div>

      <div className="mt-auto flex flex-col items-center justify-center">
        <ul className="space-y-[10px] flex flex-col items-center justify-center">
          {bottomItems.map((item: any) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex flex-col justify-center items-center px-[8px] py-[7px] rounded-md text-sm font-medium text-[#1D1D1D] ${
                    isActive
                      ? "bg-[#00AFF0] text-[#FFFFFF]"
                      : "hover:bg-[#F3F5F8]"
                  }`}
                >
                  <Image
                    height={22}
                    width={22}
                    src={isActive ? item.icon[1] : item.icon[0]}
                    alt={`${item.label} icon`}
                  />
                  <p className="text-sm">{item.label}</p>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              // onClick={() => signOut()}
              className="flex flex-col items-center px-[8px] py-[7px] text-[#1D1D1D] rounded-md text-sm font-medium hover:bg-[#F3F5F8]"
            >
              <Image
                src="/assets/logout.svg"
                alt={`Logout icon`}
                className="mr-2"
                width={22}
                height={22}
              />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
