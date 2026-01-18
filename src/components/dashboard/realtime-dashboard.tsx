"use client";

import { useEffect, useState, useMemo } from "react";
import { SensorCard } from "@/components/dashboard/sensor-card";
import { getMockLatestReadings, getMockHistoricalData } from "@/lib/data";
import type { LatestSensorReadings, SensorReading } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer, Droplets, Cloud, Wind } from "lucide-react";
import { AiSummaryDialog } from "./ai-summary-dialog";

export function RealtimeDashboard() {
  const [readings, setReadings] = useState<LatestSensorReadings | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate real-time updates from Firestore
  useEffect(() => {
    const initialData = getMockLatestReadings();
    setReadings(initialData);
    setLoading(false);

    const intervalId = setInterval(() => {
      setReadings(getMockLatestReadings());
    }, 5000); // New data every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const dailyReadings = useMemo(() => getMockHistoricalData(today).readings, [today]);

  const pm25Readings = useMemo(() => dailyReadings.map(r => r.pm25), [dailyReadings]);
  const mq135Readings = useMemo(() => dailyReadings.map(r => r.mq135), [dailyReadings]);
  const temperatureReadings = useMemo(() => dailyReadings.map(r => r.temperature), [dailyReadings]);
  const humidityReadings = useMemo(() => dailyReadings.map(r => r.humidity), [dailyReadings]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  if (!readings) {
    return <div>No data available.</div>;
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SensorCard
                title="Temperature"
                value={readings.temperature}
                unit="°C"
                icon={<Thermometer className="h-6 w-6 text-muted-foreground" />}
                sensorType="temperature"
            />
            <SensorCard
                title="Humidity"
                value={readings.humidity}
                unit="%"
                icon={<Droplets className="h-6 w-6 text-muted-foreground" />}
                sensorType="humidity"
            />
            <SensorCard
                title="PM2.5"
                value={readings.pm25}
                unit="µg/m³"
                icon={<Cloud className="h-6 w-6 text-muted-foreground" />}
                sensorType="pm25"
            />
            <SensorCard
                title="Air Quality (MQ135)"
                value={readings.mq135}
                unit="ppm"
                icon={<Wind className="h-6 w-6 text-muted-foreground" />}
                sensorType="mq135"
            />
        </div>
        <div className="flex justify-start">
            <AiSummaryDialog 
                date={today}
                pm25Readings={pm25Readings}
                mq135Readings={mq135Readings}
                temperatureReadings={temperatureReadings}
                humidityReadings={humidityReadings}
            />
        </div>
    </div>
  );
}
