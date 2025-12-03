// src/pages/CustomerPortal/components/StatusCard.tsx
import { Card, Tag, Typography } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  StopOutlined,
  EnvironmentFilled,
  SyncOutlined,
} from "@ant-design/icons";
import type { TrackingData } from "../types";

const { Title, Text } = Typography;

interface Props {
  trackingData: TrackingData;
  isUpdating: boolean;
}

const STATUS_THEME_CONFIG = {
  pending: {
    color: "text-amber-500",
    bg: "bg-amber-50",
    borderColor: "border-l-amber-500",
    icon: <ClockCircleOutlined className="text-2xl text-amber-500" />,
    title: "订单待处理",
    desc: "商家正在确认您的订单",
  },
  confirmed: {
    color: "text-blue-500",
    bg: "bg-blue-50",
    borderColor: "border-l-blue-500",
    icon: <CheckCircleOutlined className="text-2xl text-blue-500" />,
    title: "订单已确认",
    desc: "商家已接单，正在备货中",
  },
  shipping: {
    color: "text-sky-600",
    bg: "bg-sky-50",
    borderColor: "border-l-sky-600",
    icon: (
      <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
        <CarOutlined className="text-2xl text-sky-600 animate-drive" />
        <div className="absolute bottom-1 left-0 w-full h-[2px] bg-sky-200 animate-road-move" />
      </div>
    ),
    title: "运输中",
    desc: "包裹正在飞速奔向您",
  },
  delivered: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    borderColor: "border-l-emerald-600",
    icon: <CheckCircleOutlined className="text-2xl text-emerald-600" />,
    title: "订单已签收",
    desc: "感谢您的使用，期待再次为您服务",
  },
  cancelled: {
    color: "text-slate-500",
    bg: "bg-slate-100",
    borderColor: "border-l-slate-400",
    icon: <StopOutlined className="text-2xl text-slate-500" />,
    title: "订单已取消",
    desc: "该订单已取消，如有疑问请联系客服",
  },
};

const StatusCard = ({ trackingData, isUpdating }: Props) => {
  const { order, trajectories } = trackingData;
  const baseTheme = STATUS_THEME_CONFIG[order.status as keyof typeof STATUS_THEME_CONFIG] 
    || STATUS_THEME_CONFIG.pending;

  // 动态生成标题和描述
  const theme = {
    ...baseTheme,
    title: order.status === "shipping" && order.estimated_delivery
      ? `预计 ${new Date(order.estimated_delivery).toLocaleDateString()} 送达`
      : order.status === "shipping"
      ? "运输中 - 预计近日送达"
      : baseTheme.title,
    desc: order.status === "shipping" && trajectories[0]?.description
      ? `当前位置: ${trajectories[0].description}`
      : order.status === "delivered" && order.actual_delivery
      ? `签收时间: ${new Date(order.actual_delivery).toLocaleString()}`
      : baseTheme.desc,
  };

  return (
    <Card
      bordered={false}
      className={`
        shadow-lg bg-white/95 backdrop-blur rounded-2xl border-l-4 ${theme.borderColor} 
        animate-slide-up transition-all duration-500 ease-in-out
        ${isUpdating ? "ring-2 ring-offset-2 ring-blue-200 scale-[1.02]" : ""}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Text
              type="secondary"
              className="text-xs font-medium uppercase tracking-wide opacity-70"
            >
              当前状态
            </Text>
            {isUpdating && (
              <Tag
                color="processing"
                icon={<SyncOutlined spin />}
                className="border-0 bg-transparent p-0 m-0 text-blue-500 text-xs"
              >
                更新中...
              </Tag>
            )}
          </div>

          <Title
            level={3}
            className={`!my-1 !text-xl ${theme.color} flex items-center gap-2 transition-colors duration-300`}
          >
            {theme.title}
          </Title>

          <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-sm transition-all duration-300">
            {order.status === "shipping" && (
              <EnvironmentFilled className={theme.color} />
            )}
            <span>{theme.desc}</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-full ${theme.bg} flex items-center justify-center shadow-sm transition-all duration-500 ${
            isUpdating ? "rotate-12 scale-110" : ""
          }`}
        >
          {theme.icon}
        </div>
      </div>
    </Card>
  );
};

export default StatusCard;