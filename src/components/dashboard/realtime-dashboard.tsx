"use client";

import { useMemo } from "react";
import { SensorCard } from "@/components/dashboard/sensor-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer, Droplets, Cloud, Wind, Info } from "lucide-react";
import { AiSummaryDialog } from "./ai-summary-dialog";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import type { SensorReading } from "@/lib/definitions";
import { OverallQualityCard } from "./overall-quality-card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DataSimulator } from "./data-simulator";

export function RealtimeDashboard() {
  const firestore = useFirestore();

  const readingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "sensor_history"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
  }, [firestore]);

  const { data: readingsData, loading: readingsLoading } =
    useCollection<SensorReading>(readingsQuery);

  const reading = useMemo(() => readingsData?.[0], [readingsData]);

  const dailyQuery = useMemo(() => {
    if (!firestore) return null;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return query(
      collection(firestore, "sensor_history"),
      where("timestamp", ">=", startOfDay),
      orderBy("timestamp", "asc")
    );
  }, [firestore]);

  const { data: dailyReadings } = useCollection<SensorReading>(dailyQuery);

  const pm2_5Readings = useMemo(
    () => dailyReadings.map((r) => r.pm2_5),
    [dailyReadings]
  );
  const co2Readings = useMemo(
    () => dailyReadings.map((r) => r.co2),
    [dailyReadings]
  );
  const temperatureReadings = useMemo(
    () => dailyReadings.map((r) => r.temperature),
    [dailyReadings]
  );
  const humidityReadings = useMemo(
    () => dailyReadings.map((r) => r.humidity),
    [dailyReadings]
  );

  if (readingsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            There is no sensor data in the database. You can add some using the simulator below.
          </AlertDescription>
        </Alert>
        <DataSimulator />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <OverallQualityCard reading={reading} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SensorCard
          title="Temperature"
          value={reading.temperature}
          unit="°C"
          icon={<Thermometer className="h-6 w-6 text-muted-foreground" />}
          sensorType="temperature"
        />
        <SensorCard
          title="Humidity"
          value={reading.humidity}
          unit="%"
          icon={<Droplets className="h-6 w-6 text-muted-foreground" />}
          sensorType="humidity"
        />
        <SensorCard
          title="PM2.5"
          value={reading.pm2_5}
          unit="µg/m³"
          icon={<Cloud className="h-6 w-6 text-muted-foreground" />}
          sensorType="pm2_5"
        />
        <SensorCard
          title="CO2"
          value={reading.co2}
          unit="ppm"
          icon={<Wind className="h-6 w-6 text-muted-foreground" />}
          sensorType="co2"
        />
      </div>
      <div className="flex justify-start">
        <AiSummaryDialog
          date={today}
          pm25Readings={pm2_5Readings}
          co2Readings={co2Readings}
          temperatureReadings={temperatureReadings}
          humidityReadings={humidityReadings}
        />
      </div>
      <DataSimulator />
    </div>
  );
}
