// src/pages/CustomerPortal/components/TrajectoryTimeline.tsx
import { Card, Timeline, Empty } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import type { TrajectoryPoint } from "@/types/order";
import { STATUS_MAP } from "../constants";

interface Props {
  trajectories: TrajectoryPoint[];
  isShipping: boolean;
  isUpdating: boolean;
}

const TrajectoryTimeline = ({ trajectories, isShipping, isUpdating }: Props) => {
  return (
    <Card
      bordered={false}
      className="shadow-lg bg-white/95 backdrop-blur rounded-2xl flex-1 min-h-[200px]"
    >
      <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
        <ClockCircleOutlined className="text-slate-400" />
        <span className="font-bold text-slate-700">物流进度</span>
      </div>

      {trajectories.length > 0 ? (
        <Timeline
          pending={isShipping ? "正在运输中..." : false}
          items={trajectories.map((item, index) => {
            const statusConfig = STATUS_MAP[item.status] || {
              text: item.status,
              color: "gray",
            };
            const isLatest = index === 0;

            return {
              color: isLatest ? "#1677ff" : "gray",
              dot: isLatest ? (
                <div
                  className={`w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-100 ${
                    isUpdating ? "animate-ping" : ""
                  }`}
                />
              ) : null,
              children: (
                <div
                  className={`pb-6 ${
                    isLatest ? "text-slate-800" : "text-slate-400"
                  } transition-colors duration-500`}
                >
                  <div className="font-medium text-sm flex justify-between items-center mb-1">
                    <span>{statusConfig.text}</span>
                    <span className="text-xs font-normal opacity-70 font-mono">
                      {new Date(item.timestamp).toLocaleString([], {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    className={`text-xs leading-relaxed opacity-80 bg-slate-50 p-2 rounded border border-slate-100 ${
                      isLatest && isUpdating ? "bg-blue-50 border-blue-100" : ""
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              ),
            };
          })}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无物流轨迹信息"
        />
      )}
    </Card>
  );
};

export default TrajectoryTimeline;