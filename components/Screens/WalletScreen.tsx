import { useRouter } from "next/dist/client/router";
import React, { FC } from "react";
import BackButton from "../Generics/BackButton";

const WalletScreen: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <BackButton />
    </div>
  );
};

export default WalletScreen;
