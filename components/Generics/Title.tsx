import React, { FC } from "react";

const Title: FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col justify-start">
      <p className="font-bold text-4xl">{title}</p>
      {subtitle ? <p className="text-gray-500">{subtitle}</p> : null}
    </div>
  );
};

export default Title;
