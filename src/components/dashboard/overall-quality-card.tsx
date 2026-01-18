"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SensorReading } from "@/lib/definitions";
import { getOverallStatus, overallStatusConfig } from "@/lib/air-quality";

export function OverallQualityCard({ reading }: { reading: SensorReading }) {
  const overallStatus = getOverallStatus(reading);
  const config = overallStatusConfig[overallStatus];

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
