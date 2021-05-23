import React, { FC } from "react";

const Title: FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="flex flex-col justify-start">
      <p className="font-bold text-2xl">{title}</p>
      {subtitle ? <p className="font-light">{subtitle}</p> : null}
    </div>
  );
};

export default Title;
