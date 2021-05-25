import { ParentSize } from "@visx/responsive";
import React, { FC } from "react";
import OverviewChart2 from "../Charts/OverviewChart2";
import Title from "../Generics/Title";

const DashboardScreen: FC = () => {
  return (
    <div>
      <Title
        title="Overview"
        subtitle="An overview of your portfolio and assets performance"
      />
      <div className="flex flex-col mt-8 w-full h-32">
        {/* <ParentSize>
          {({ width, height }) => (
            <OverviewChart width={width} height={height} />
          )}
        </ParentSize> */}
        <OverviewChart2 />
      </div>
    </div>
  );
};

export default DashboardScreen;
