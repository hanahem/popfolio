import React, { FC } from "react";
import Title from "../Generics/Title";
import AddWallet from "../Profile/AddWallet";
import AddAsset from "../Profile/AddAsset";

const ProfileScreen: FC = () => {
  return (
    <div>
      <Title title="Profile" subtitle="Here you can manage your wallets and assets" />
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 mt-8">
        <AddWallet />
        <AddAsset />
      </div>
    </div>
  );
};

export default ProfileScreen;
