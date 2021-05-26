import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import ProfileScreen from "../components/Screens/ProfileScreen";
import { CustomState } from "../store/store";
import { useTheme } from "next-themes";

const profile: FC = () => {
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
      <ProfileScreen />
    </div>
  );
};

export default profile;
