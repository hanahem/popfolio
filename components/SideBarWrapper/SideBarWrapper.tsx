import React, { FC, ReactNode } from "react";
import { useRouter } from "next/dist/client/router";
import HomeIcon from "../icons/HomeIcon";
import StatsIcon from "../icons/StatsIcon";
import ProfileIcon from "../icons/ProfileIcon";
import HelpIcon from "../icons/HelpIcon";
import PlusIcon from "../icons/PlusIcon";
import NightIcon from "../icons/NightIcon";
import DollarIcon from "../icons/DollarIcon";
import { Currencies, CustomState, updateCurrency, updateDarkMode } from "../../store/store";
import { useSelector } from "react-redux";
import EuroIcon from "../icons/EuroIcon";
import { useTheme } from "next-themes";

const SidebarWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = "/" + router.pathname.split("/")[1];

  const isPath = (path: string): boolean => path === pathname;
  const goTo = (path: string): Promise<boolean> => router.push(path);

  const currency = useSelector((state: CustomState) => state.currency);

  const { theme } = useTheme();

  return (
    <div className="bg-white dark:bg-darkbg flex min-h-screen w-full">
      <nav className="bg-gray-50 dark:bg-darkbg w-72 h-screen fixed flex flex-col items-center justify-start border-r-2 border-gray dark:border-darkgray">
        <div className="h-20 w-full">
          <div className="h-20 w-20 my-3 ml-4 flex items-center" onClick={() => router.push("/")}>
            <img src="/images/lollipop.png" alt="Sidebar icon" className="p-2 h-2/3 w-2/3" />
            <p className="font-semibold text-3xl italic">Popfolio.</p>
          </div>
        </div>
        <div className="mt-10 w-full flex flex-col items-center">
          <div className={`sidenav ${isPath("/") ? "active" : ""}`} onClick={() => goTo("/")}>
            <HomeIcon color={theme === "dark" ? "white" : "#62686e"} />
            <p className="text-sideIcon dark:text-white ml-4">Dashboard</p>
          </div>
          <div
            className={`sidenav ${isPath("/stats") ? "active" : ""}`}
            onClick={() => goTo("/stats")}
          >
            <StatsIcon color={theme === "dark" ? "white" : "#62686e"} />
            <p className="text-sideIcon dark:text-white ml-4">Statistics</p>
          </div>
          <div
            className={`sidenav ${isPath("/profile") ? "active" : ""}`}
            onClick={() => goTo("/profile")}
          >
            <ProfileIcon color={theme === "dark" ? "white" : "#62686e"} />
            <p className="text-sideIcon dark:text-white ml-4">Profile</p>
          </div>
          <div
            className={`sidenav ${isPath("/info") ? "active" : ""}`}
            onClick={() => goTo("/info")}
          >
            <HelpIcon color={theme === "dark" ? "white" : "#62686e"} />
            <p className="text-sideIcon dark:text-white ml-4">Info</p>
          </div>
        </div>
      </nav>
      <div className="dark:bg-darkfg w-full ml-72">
        <nav className="bg-white dark:bg-darkbg h-20 border-b border-gray dark:border-darkbg flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <button className="btn-primary flex items-center" onClick={() => goTo("/profile")}>
              <PlusIcon color="white" />
              Add a wallet or an asset
            </button>
          </div>
          <div className="mr-4 grid grid-cols-2 gap-2">
            <button className="optionbtn" onClick={() => updateCurrency()}>
              {currency == Currencies.USD ? (
                <DollarIcon color={theme === "dark" ? "white" : "#62686e"} />
              ) : (
                <EuroIcon color={theme === "dark" ? "white" : "#62686e"} />
              )}
            </button>
            <button className="optionbtn" onClick={() => updateDarkMode()}>
              <NightIcon color={theme === "dark" ? "white" : "#62686e"} />
            </button>
          </div>
        </nav>
        <div className="p-12 relative">{children}</div>
      </div>
    </div>
  );
};

export default SidebarWrapper;
