import Identicon from "@polkadot/react-identicon";
import React, { FC } from "react";

type Props = { icon?: string; title: string; subtitle?: string };

const SelectItem: FC<Props> = ({ icon, title, subtitle }) => {
  return (
    <div className="flex flex-col w-full hover:bg-blue-100">
      <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
          <div className="w-10 flex flex-col items-center">
            {icon ? (
              <div className="flex relative bg-orange-500 justify-center items-center w-10 h-10">
                <img className="rounded-full w-10 h-10" alt="A" src={icon} />
              </div>
            ) : (
              <div className="rounded-full w-10 h-10">
                <Identicon
                  value={title}
                  size={32}
                  theme={"ethereum"}
                  className="rounded-identicon"
                />
              </div>
            )}{" "}
          </div>
          <div className="w-full items-center flex">
            <div className="mx-2 mt-1">
              {title}
              {subtitle ? (
                <div className="text-xs truncate w-full normal-case font-normal -mt-1 text-gray-500">
                  {subtitle}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectItem;
