import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomState, loadDb } from "../../store/store";
import { db } from "../../utils/dbInit";
import OverviewChart from "../Charts/OverviewChart";
import Title from "../Generics/Title";

const DashboardScreen: FC = () => {
  const dispatch = useDispatch();

  const storeDb = useSelector((state: CustomState) => state.db);

  useEffect(() => {
    (async function () {
      try {
        dispatch(loadDb(db));
      } catch (e) {
        console.error("DB load error: ", e);
      }
    })();
  }, [db]);

  return (
    <div>
      <Title
        title="Overview"
        subtitle="An overview of your portfolio and assets performance"
      />
      <div className="flex flex-col mt-8 w-full h-32">
        {storeDb ? (
          <OverviewChart ids={storeDb.plainAssets} assets={storeDb.assets} />
        ) : (
          <div className="h-44 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
