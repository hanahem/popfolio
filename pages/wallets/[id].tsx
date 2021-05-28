import { useTheme } from "next-themes";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import WalletScreen from "../../components/Screens/WalletScreen";
import { CustomState } from "../../store/store";

const WalletIndex: FC = () => {
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
      <WalletScreen />
    </div>
  );
};

export default WalletIndex;
