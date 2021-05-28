import { useRouter } from "next/dist/client/router";
import React, { FC } from "react";
import LeftArrowSmIcon from "../icons/LeftArrowSmIcon";

const BackButton: FC = () => {
  const router = useRouter();
  return (
    <div
      className="flex justify-start items-center p-2 hover:bg-gray-100 rounded cursor-pointer w-max mb-8"
      onClick={() => router.back()}
    >
      <LeftArrowSmIcon color="#62686e" />
      <p className="mx-2 text-sideIcon">Back</p>
    </div>
  );
};

export default BackButton;
