"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SensorReading, AirQualityStatus } from "@/lib/definitions";

type OverallStatus = "Good" | "Moderate" | "Poor";

const statusConfig: Record<
  OverallStatus,
  {
    className: string;
    label: string;
    description: string;
  }
> = {
  Poor: {
    className: "bg-red-500",
    label: "POOR (Danger)",
    description: "One or more sensor readings are at a poor level.",
  },
  Moderate: {
    className: "bg-green-500",
    label: "MODERATE",
    description: "Some sensor readings are at a moderate level.",
  },
  Good: {
    className: "bg-blue-500",
    label: "GOOD",
    description: "All sensor readings are at a good level.",
  },
};

function getIndividualStatus(
  value: number,
  type: "pm2_5" | "co2"
): AirQualityStatus {
  if (type === "pm2_5") {
    if (value <= 12) return "Good";
    if (value <= 35.4) return "Moderate";
    return "Poor";
  }
  if (type === "co2") {
    if (value <= 1000) return "Good";
    if (value <= 2000) return "Moderate";
    return "Poor";
  }
  return "N/A";
}

function getOverallStatus(reading: SensorReading): OverallStatus {
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

export function OverallQualityCard({ reading }: { reading: SensorReading }) {
  const overallStatus = getOverallStatus(reading);
  const config = statusConfig[overallStatus];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Air Quality</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className={cn("h-8 w-8 rounded-full", config.className)} />
        <div>
          <p className="text-2xl font-bold">{config.label}</p>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
