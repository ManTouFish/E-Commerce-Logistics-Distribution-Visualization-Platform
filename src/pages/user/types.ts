import type { TrajectoryPoint, Order } from "@/types/order";
import type { Coordinate } from "@/types/amap";

export interface TrackingData {
  order: Order;
  trajectories: TrajectoryPoint[];
}

export interface TrajectoryPointWithCoords extends TrajectoryPoint, Coordinate {}

export interface StatusConfig {
  text: string;
  icon: React.ReactNode;
  color: string;
}