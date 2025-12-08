// src/pages/CustomerPortal/constants.tsx
import {
  RocketOutlined,
  CarOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { StatusConfig } from "./types";

export const STATUS_MAP: Record<string, StatusConfig> = {
  pending: { text: "待发货", icon: <LoadingOutlined />, color: "gray" },
  confirmed: { text: "已确认", icon: <CheckCircleOutlined />, color: "blue" },
  shipping: { text: "运输中", icon: <CarOutlined />, color: "#1677ff" },
  delivered: { text: "已送达", icon: <CheckCircleOutlined />, color: "#52c41a" },
  cancelled: { text: "已取消", icon: <StopOutlined />, color: "red" },
  pickup: { text: "已揽收", icon: <CheckCircleOutlined />, color: "blue" },
  in_transit: { text: "运输中", icon: <RocketOutlined />, color: "blue" },
  out_for_delivery: { text: "派送中", icon: <CarOutlined />, color: "green" },
};