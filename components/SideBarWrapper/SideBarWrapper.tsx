import React, { FC, ReactNode } from "react";
import { useRouter } from "next/dist/client/router";
import HomeIcon from "../icons/HomeIcon";
import StatsIcon from "../icons/StatsIcon";
import ProfileIcon from "../icons/ProfileIcon";
import HelpIcon from "../icons/HelpIcon";
import PlusIcon from "../icons/PlusIcon";

const SidebarWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = "/" + router.pathname.split("/")[1];

  const isPath = (path: string): boolean => path === pathname;
  const goTo = (path: string): Promise<boolean> => router.push(path);

  return (
    <div className="bg-white flex min-h-screen w-full">
      <nav className="bg-white w-72 h-screen fixed flex flex-col items-center justify-start border-r-2 border-gray">
        <div className="h-20 w-full">
          <div
            className="h-20 w-20 my-3 ml-4 flex items-center"
            onClick={() => router.push("/")}
          >
            <img
              src="/images/h.png"
              alt="Sidebar icon"
              className="p-2 h-full w-full"
            />
            <p className="font-bold text-3xl">Harpy</p>
          </div>
        </div>
        <div className="mt-10 w-full flex flex-col items-center">
          <div
            className={`sidenav ${isPath("/") ? "active" : ""}`}
            onClick={() => goTo("/")}
          >
            <HomeIcon color="#62686e" />
            <p className="text-sideIcon ml-4">Dashboard</p>
          </div>
          <div
            className={`sidenav ${isPath("/stats") ? "active" : ""}`}
            onClick={() => goTo("/stats")}
          >
            <StatsIcon color="#62686e" />
            <p className="text-sideIcon ml-4">Statistics</p>
          </div>
          <div
            className={`sidenav ${isPath("/profile") ? "active" : ""}`}
            onClick={() => goTo("/profile")}
          >
            <ProfileIcon color="#62686e" />
            <p className="text-sideIcon ml-4">Profile</p>
          </div>
          <div
            className={`sidenav ${isPath("/info") ? "active" : ""}`}
            onClick={() => goTo("/info")}
          >
            <HelpIcon color="#62686e" />
            <p className="text-sideIcon ml-4">Info</p>
          </div>
        </div>
      </nav>
      <div className="bg-gray-50 w-full ml-72">
        <nav className="bg-white h-20 border-b border-gray flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <button className="btn-primary flex items-center">
              <PlusIcon color="white" />
              Add a wallet or an asset
            </button>
          </div>
          <div>
            <p>options</p>
          </div>
        </nav>
        <div className="p-12">{children}</div>
      </div>
    </div>
  );
};

export default SidebarWrapper;
