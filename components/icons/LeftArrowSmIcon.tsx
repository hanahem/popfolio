import React, { FC } from "react";

const LeftArrowSmIcon: FC<{ color: string }> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 17l-5-5m0 0l5-5m-5 5h12"
      />
    </svg>
  );
};

export default LeftArrowSmIcon;
