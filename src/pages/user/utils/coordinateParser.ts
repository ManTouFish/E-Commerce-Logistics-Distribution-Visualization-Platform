import type { TrajectoryPoint, Order } from "@/types/order";
import type { Coordinate } from "@/types/amap";


interface TrajectoryPointWithCoords extends TrajectoryPoint, Coordinate {}

/**
 * 从轨迹点解析坐标
 */
export const parseTrajectoryCoordinate = (
  point: TrajectoryPoint
): Coordinate | null => {
  const pointWithCoords = point as TrajectoryPointWithCoords;
  
  // 1. 直接有 longitude/latitude
  if (
    typeof pointWithCoords.longitude === "number" &&
    typeof pointWithCoords.latitude === "number"
  ) {
    return {
      longitude: pointWithCoords.longitude,
      latitude: pointWithCoords.latitude,
    };
  }

  // 2. location 是字符串 "lng,lat"
  const pointWithLocation = point as TrajectoryPoint & { 
    location?: string | { coordinates?: number[] } 
  };
  
  if (typeof pointWithLocation.location === "string") {
    const [lng, lat] = pointWithLocation.location.split(",").map(Number);
    if (!isNaN(lng) && !isNaN(lat)) {
      return { longitude: lng, latitude: lat };
    }
  }

  // 3. location 是 GeoJSON 格式
  if (
    pointWithLocation.location &&
    typeof pointWithLocation.location === "object" &&
    Array.isArray(pointWithLocation.location.coordinates)
  ) {
    const [lng, lat] = pointWithLocation.location.coordinates;
    if (typeof lng === "number" && typeof lat === "number") {
      return { longitude: lng, latitude: lat };
    }
  }

  return null;
};

/**
 * 从订单解析起点/终点坐标
 */
export const parseOrderCoordinate = (
  order: Order,
  type: "sender" | "receiver"
): Coordinate | undefined => {
  const orderData = order as Order & {
    sender_longitude?: number;
    sender_latitude?: number;
    receiver_longitude?: number;
    receiver_latitude?: number;
    sender_location?: string | { coordinates?: number[] };
    receiver_location?: string | { coordinates?: number[] };
  };

  // 1. 直接有坐标字段
  if (type === "sender") {
    if (
      typeof orderData.sender_longitude === "number" &&
      typeof orderData.sender_latitude === "number"
    ) {
      return {
        longitude: orderData.sender_longitude,
        latitude: orderData.sender_latitude,
      };
    }
  } else {
    if (
      typeof orderData.receiver_longitude === "number" &&
      typeof orderData.receiver_latitude === "number"
    ) {
      return {
        longitude: orderData.receiver_longitude,
        latitude: orderData.receiver_latitude,
      };
    }
  }

  // 2. location 字段
  const locationField =
    type === "sender" ? orderData.sender_location : orderData.receiver_location;

  if (typeof locationField === "string") {
    const [lng, lat] = locationField.split(",").map(Number);
    if (!isNaN(lng) && !isNaN(lat)) {
      return { longitude: lng, latitude: lat };
    }
  }

  if (
    locationField &&
    typeof locationField === "object" &&
    Array.isArray(locationField.coordinates)
  ) {
    const [lng, lat] = locationField.coordinates;
    if (typeof lng === "number" && typeof lat === "number") {
      return { longitude: lng, latitude: lat };
    }
  }

  return undefined;
};