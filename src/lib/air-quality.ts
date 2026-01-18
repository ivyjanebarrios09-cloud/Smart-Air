import type { SensorReading, AirQualityStatus, SensorType } from "@/lib/definitions";

export type OverallStatus = "Good" | "Moderate" | "Poor";

export const overallStatusConfig: Record<
  OverallStatus,
  {
    className: string;
    label: string;
    description: string;
  }
> = {
  Poor: {
    className: "bg-red-500",
    label: "POOR",
    description: "One or more sensor readings are at a poor level.",
  },
  Moderate: {
    className: "bg-green-500",
    label: "MODERATE",
    description: "One or more sensor readings are at a moderate level.",
  },
  Good: {
    className: "bg-blue-500",
    label: "GOOD",
    description: "All sensor readings are at a good level.",
  },
};

export const sensorStatusColors: Record<AirQualityStatus, string> = {
  Good: "bg-green-500",
  Moderate: "bg-yellow-500",
  Poor: "bg-red-500",
  "N/A": "bg-gray-400",
};

export function getIndividualStatus(
  value: number,
  type: SensorType
): AirQualityStatus {
  if (type === "pm2_5") {
    if (value <= 35) return "Good";
    if (value <= 75) return "Moderate";
    return "Poor";
  }
  if (type === "co2") {
    if (value <= 600) return "Good";
    if (value <= 800) return "Moderate";
    return "Poor";
  }
  return "N/A";
}

type ReadingForStatus = {
    pm2_5: number;
    co2: number;
}

export function getOverallStatus(reading: ReadingForStatus): OverallStatus {
  const pm2_5Status = getIndividualStatus(reading.pm2_5, "pm2_5");
  const co2Status = getIndividualStatus(reading.co2, "co2");

  const statuses = [pm2_5Status, co2Status];

  if (statuses.includes("Poor")) {
    return "Poor";
  }
  if (statuses.includes("Moderate")) {
    return "Moderate";
  }
  return "Good";
}
