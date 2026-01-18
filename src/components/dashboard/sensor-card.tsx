import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SensorType } from "@/lib/definitions";
import { getIndividualStatus, sensorStatusColors } from "@/lib/air-quality";

type SensorCardProps = {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  sensorType: SensorType;
};

export function SensorCard({
  title,
  value,
  unit,
  icon,
  sensorType,
}: SensorCardProps) {
  const status = getIndividualStatus(value, sensorType);

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
            <span
              className={cn(
                "mr-2 h-2 w-2 rounded-full",
                sensorStatusColors[status]
              )}
            />
            <span>{status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
