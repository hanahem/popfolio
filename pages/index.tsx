import React, { FC, useEffect } from "react";
import DashboardScreen from "../components/Screens/DashboardScreen";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { CustomState } from "../store/store";

const IndexPage: FC = () => {
  const { setTheme } = useTheme();

  const darkMode = useSelector((state: CustomState) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [darkMode]);

  return (
    <div className="dark:text-white">
      <DashboardScreen />
    </div>
  );
};

export default IndexPage;
