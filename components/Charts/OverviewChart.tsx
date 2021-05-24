import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultStyles,
  Tooltip,
  TooltipWithBounds,
  withTooltip,
} from "@visx/tooltip";
import { timeFormat } from "d3-time-format";
import { max, extent, bisector } from "d3-array";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AreaClosed, Bar, Line } from "@visx/shape";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { CryptoPrice, TimeFrame } from "../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { CustomState, getPrices } from "../../store/store";
import { FRAMES } from "../../utils";

type TimeFrameProps = {
  selectedTimeFrame: string;
  setTimeFrame: (v: string) => void;
};

const TimeFrameControls: FC<TimeFrameProps> = ({
  selectedTimeFrame,
  setTimeFrame,
}) => {
  return (
    <div className="absolute top-4 left-4">
      <div className="grid grid-cols-4 grid-rows-1 gap-1">
        {FRAMES.map((frame: TimeFrame, idx: number) => {
          return (
            <div
              key={idx}
              className={`bg-white bg-opacity-75 hover:bg-opacity-100 p-1 flex justify-center items-center cursor-pointer ${
                selectedTimeFrame === frame.value
                  ? "bg-opacity-100 border border-gray-400"
                  : ""
              }`}
              onClick={() => setTimeFrame(frame.value)}
            >
              <p className="text-gray-600 text-sm">{frame.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type TooltipData = CryptoPrice;

export const background = "#3b6978";
export const background2 = "#204051";
export const accentColor = "#edffea";
export const accentColorDark = "#75daad";
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid white",
  color: "white",
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d: CryptoPrice) => new Date(d.date);
const getStockValue = (d: CryptoPrice) => d.close;
const bisectDate = bisector<CryptoPrice, Date>((d) => new Date(d.date)).left;

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;

    const dispatch = useDispatch();
    const [stock, setStock] = useState([
      { date: new Date().toISOString(), close: 0 },
    ]);
    const prices = useSelector((state: CustomState) => state.prices);

    const [selectedTimeFrame, setTimeFrame] = useState("max");

    useEffect(() => {
      (async function () {
        try {
          await dispatch(getPrices(selectedTimeFrame));
        } catch (e) {
          console.error("getPrices error: ", e);
        }
      })();
    }, [selectedTimeFrame]);

    useEffect(() => {
      if (prices.data.prices) {
        setStock(
          prices.data.prices.map((p: number[]) => ({
            date: new Date(p[0]).toISOString(),
            close: p[1],
          }))
        );
      }
    }, [prices.data]);

    // useEffect(() => {
    //   if (selectedTimeFrame) {
    //     (async function () {
    //       try {
    //         await dispatch(getPrices(selectedTimeFrame));
    //       } catch (e) {
    //         console.error("getPrices error: ", e);
    //       }
    //     })();
    //   }
    // }, [selectedTimeFrame]);

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left, stock]
    );
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight, stock]
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(stock, x0, 1);
        const d0 = stock[index - 1];
        const d1 = stock[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale, stock]
    );

    return (
      <div className="relative">
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={0}
          />
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            from={accentColor}
            to={accentColor}
            toOpacity={0.1}
          />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<CryptoPrice>
            data={stock}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getStockValue(d)) ?? 0}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: "center",
                transform: "translateX(-50%)",
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
        <TimeFrameControls
          selectedTimeFrame={selectedTimeFrame}
          setTimeFrame={setTimeFrame}
        />
      </div>
    );
  }
);
