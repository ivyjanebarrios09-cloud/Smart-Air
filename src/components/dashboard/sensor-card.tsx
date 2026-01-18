import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AirQualityStatus, SensorType } from "@/lib/definitions";

type SensorCardProps = {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  sensorType: SensorType;
};

function getStatus(value: number, type: SensorType): AirQualityStatus {
  if (type === "pm25") {
    if (value <= 12) return "Good";
    if (value <= 35.4) return "Moderate";
    return "Poor";
  }
  if (type === "mq135") {
    if (value <= 100) return "Good";
    if (value <= 300) return "Moderate";
    return "Poor";
  }
  return "N/A";
}

const statusColors: Record<AirQualityStatus, string> = {
  Good: "bg-green-500",
  Moderate: "bg-yellow-500",
  Poor: "bg-red-500",
  "N/A": "bg-gray-400",
};

export function SensorCard({ title, value, unit, icon, sensorType }: SensorCardProps) {
  const status = getStatus(value, sensorType);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toFixed(1)} {unit}
        </div>
        {status !== "N/A" && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span className={cn("mr-2 h-2 w-2 rounded-full", statusColors[status])} />
            <span>{status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
