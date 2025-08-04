"use client";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import HomeIcon from "../../assets/icons/dashboard/Home.svg";
import AnalyticsIcon from "../../assets/icons/dashboard/Analytics.svg";
import HomeFill from "../../assets/icons/dashboard/Home Fill.svg";
import AnalyticsFill from "../../assets/icons/dashboard/Analytics Fill.svg";

import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  to: string;
  icon: ReactNode;
  fillIcon: ReactNode;
}

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const InstructorSidebar = ({ isOpen = true, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();
  // Dashboard navigation items
  const dashboardNav: NavItem[] = [
    {
      name: "Overview",
      to: "/instructor/dashboard/overview",
      icon: (
        <Image
          src={HomeIcon}
          width={20}
          height={20}
          alt="Picture of the author"
        />
      ),
      fillIcon: (
        <Image
          src={HomeFill}
          width={20}
          height={20}
          alt="Picture of the author"
        />
      ),
    },
    {
      name: "Courses",
      to: "/instructor/dashboard/analytics",
      icon: (
        <Image
          src={AnalyticsIcon}
          width={20}
          height={20}
          alt="Picture of the author"
        />
      ),
      fillIcon: (
        <Image
          src={AnalyticsFill}
          width={20}
          height={20}
          alt="Picture of the author"
        />
      ),
    },
  ];

  return (
    <aside
      className={`${isOpen ? "translate-x-0" : "-translate-x-full"} 
        fixed md:static z-20 w-[263px] h-screen text-gray-500 
        transition-transform duration-200 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 pb-0 border-gray-700">
        <h1 className="text-xl font-semibold bg-purple">Dashboard</h1>
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1 rounded-lg hover:bg-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="p-4 space-y-6">
        <div>
          <ul className="space-y-2">
            {dashboardNav.map((item) => (
              <li
                key={item.to}
                className={`${
                  pathname.includes(item.to)
                    ? "bg-[#EAF3FD] text-[#3385F0]" // Highlight the active item
                    : "hover:bg-[#EAF3FD]"
                } py-1.5 px-2.5 rounded-xl`}
              >
                <Link href={item.to} className="flex">
                  <span className="mr-3">
                    {" "}
                    {pathname.includes(item.to) ? item.fillIcon : item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default InstructorSidebar;