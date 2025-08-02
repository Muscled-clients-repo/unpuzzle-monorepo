import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItemsStudents } from "../../../lib/menu-list";
import { MenuItem } from "../../../types/lib.types";
import logo from '../assets/logo.svg';
import LogoutIcon from "../assets/logout.svg";
import Image from "next/image";

const Sidebar: React.FC<SidebarProps> = ({ }) => {
  const pathname = usePathname();
  // const [expandedMenu, setExpandedMenu] = useState(null); // Not currently used
  const dispatch = useDispatch();
  const { persistent } = useSelector((state : RootState) => state.sidebar);

  // Always use student menu items
  const menuItems : MenuItem[] = menuItemsStudents
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
          <Link href="/courses">
            <Image src={logo} alt="Logo" width={64} height={64} />
          </Link>
        </div>
        <ul className="space-y-[10px]" onMouseEnter={() => dispatch(showSidebar())} onMouseLeave={handleMouseLeave}>
          {topItems.map((item) => (
          <li key={item.path}>
            <div className="flex flex-row items-center justify-center relative cursor-pointer">
            {item.path ? (
              <Link
                href={item.path}
                className={`flex flex-col items-center justify-center w-[80px] h-[70px] gap-[10px] px-[8px] py-[7px] rounded-md text-sm font-medium ${
                  pathname === item.path
                    ? "bg-[#00AFF0] text-[#FFFFFF]"
                    : "hover:bg-[#F3F5F8] text-[#1D1D1D]"
                }`}
              >
                <Image
                  height={22}
                  width={22}
                  src={pathname === item.path ? item.icon[1] : item.icon[0]}
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
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col items-center justify-center">
        <ul className="space-y-[10px] flex flex-col items-center justify-center">
          {bottomItems.map((item:any) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex flex-col justify-center items-center px-[8px] py-[7px] rounded-md text-sm font-medium text-[#1D1D1D] ${
                    isActive ? "bg-[#00AFF0] text-[#FFFFFF]" : "hover:bg-[#F3F5F8]"
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
              //onClick={clearCookies}
              className="flex flex-col items-center px-[8px] py-[7px] text-[#1D1D1D] rounded-md text-sm font-medium hover:bg-[#F3F5F8]"
            >
              <Image 
                src={LogoutIcon} 
                alt="Logout icon" 
                width={22} 
                height={22} 
              />
              <span className="text-sm">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;