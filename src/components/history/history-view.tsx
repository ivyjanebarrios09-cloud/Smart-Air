"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Thermometer, Droplets, Cloud, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import type { SensorReading, SensorType } from "@/lib/definitions";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, type Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { OverallQualityCard } from "@/components/dashboard/overall-quality-card";

const chartConfig: ChartConfig = {
  value: {
    label: "Value",
  },
  temperature: {
    label: "Temp (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
  pm2_5: {
    label: "PM2.5 (µg/m³)",
    color: "hsl(var(--chart-3))",
  },
  co2: {
    label: "CO2 (ppm)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

function SensorChart({ data, sensorType }: { data: SensorReading[], sensorType: SensorType }) {
  const chartData = useMemo(() => data.map(d => {
    const timestamp = d.timestamp && typeof (d.timestamp as any).toDate === 'function' 
      ? (d.timestamp as Timestamp).toDate() 
      : new Date(d.timestamp as number);
    return {
      time: format(timestamp, "HH:mm"),
      [sensorType]: d[sensorType],
    }
  }), [data, sensorType]);

  const config = { [sensorType]: chartConfig[sensorType] } as ChartConfig;

  if (!chartData || chartData.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-muted-foreground">No data for this day.</div>;
  }

  return (
    <ChartContainer config={config} className="min-h-[300px] w-full">
      <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey={sensorType}
          type="monotone"
          stroke={`var(--color-${sensorType})`}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

const sensorTabs: { type: SensorType, label: string, icon: React.ReactNode }[] = [
    { type: 'temperature', label: 'Temperature', icon: <Thermometer className="h-5 w-5 text-chart-1" /> },
    { type: 'humidity', label: 'Humidity', icon: <Droplets className="h-5 w-5 text-chart-2" /> },
    { type: 'pm2_5', label: 'PM2.5', icon: <Cloud className="h-5 w-5 text-chart-3" /> },
    { type: 'co2', label: 'CO2', icon: <Wind className="h-5 w-5 text-chart-4" /> },
];

export function HistoryView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const firestore = useFirestore();

  const historicalDataQuery = useMemo(() => {
    if (!firestore || !date) return null;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return query(
      collection(firestore, "sensor_history"),
      where("timestamp", ">=", startOfDay),
      where("timestamp", "<=", endOfDay),
      orderBy("timestamp", "asc")
    );
  }, [firestore, date]);

  const { data: historicalData, loading: historyLoading } = useCollection<SensorReading>(historicalDataQuery);

  const dailyAverageReading = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return null;
    }

    const totalReadings = historicalData.reduce(
      (acc, reading) => {
        acc.pm2_5 += reading.pm2_5;
        acc.co2 += reading.co2;
        acc.temperature += reading.temperature;
        acc.humidity += reading.humidity;
        return acc;
      },
      { pm2_5: 0, co2: 0, temperature: 0, humidity: 0 }
    );

    const count = historicalData.length;

    return {
      pm2_5: totalReadings.pm2_5 / count,
      co2: totalReadings.co2 / count,
      temperature: totalReadings.temperature / count,
      humidity: totalReadings.humidity / count,
      timestamp: historicalData[0].timestamp,
      air_quality: "",
    };
  }, [historicalData]);


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(d) => d > new Date() || d < new Date("2024-01-01")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {historyLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        dailyAverageReading && <OverallQualityCard reading={dailyAverageReading as SensorReading} />
      )}

      {historyLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sensorTabs.map((tab) => (
            <Card key={tab.type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-6 w-5" />
                  <Skeleton className="h-6 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sensorTabs.map((tab) => (
            <Card key={tab.type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {tab.icon}
                  {tab.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SensorChart data={historicalData} sensorType={tab.type} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
