import React, { useState, useEffect } from "react";
import Image from "next/image";

// import { useLocation } from "react-router-dom";
import { usePathname } from "next/navigation";

// import logo from "../assets/headerLogo.svg";
// import darkModeIcon from "../assets/darkModeIcon.svg";
// import lightModeIcon from "../assets/lightModeIcon.svg";

const AnnotationViewHeader = () => {
  const pathname = usePathname();
  // Check if the current route is an annotation page
  const isAnnotationPage = pathname === "/student-annotations";

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Dark mode only for annotation pages
    return isAnnotationPage && localStorage.getItem("darkMode") === "true";
  });

  // Update dark mode on route change
  useEffect(() => {
    if (isAnnotationPage) {
      const storedMode = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(storedMode);
      document.documentElement.classList.toggle("dark", storedMode);
    } else {
      // Non-annotation pages should always be light mode
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [pathname, isAnnotationPage]); // Depend on route changes and annotation state

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode ? "true" : "false");
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <div
      className={`flex justify-between items-center px-6 py-4 border-b ${isAnnotationPage && isDarkMode
        ? "dark bg-[#0F0F0F] text-white"
        : "bg-white text-[#1F2128]"
        } h-[60px] sticky top-0 z-50`}
    >
      <div className="flex items-center gap-2">
        {/* <img src={logo} alt="logo" /> */}
        <Image src="/assets/headerLogo.svg" width={20} height={20} alt="logo" />
        <p className="font-bold text-xl">Unpuzzle</p>
      </div>

      {isAnnotationPage && (
        // <img
        //   src={isDarkMode ? lightModeIcon : darkModeIcon}
        //   alt="Toggle Theme"
        //   onClick={toggleDarkMode}
        //   className="cursor-pointer"
        // />
        <Image
          src={
            isDarkMode
              ? "/assets/lightModeIcon.svg"
              : "/assets/darkModeIcon.svg"
          }
          width={20}
          height={20}
          alt="Toggle Theme"
          onClick={toggleDarkMode}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default AnnotationViewHeader;
