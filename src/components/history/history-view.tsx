"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Thermometer, Droplets, Cloud, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import type { SensorReading, SensorType } from "@/lib/definitions";
import { getMockHistoricalData } from "@/lib/data";

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
  pm25: {
    label: "PM2.5 (µg/m³)",
    color: "hsl(var(--chart-3))",
  },
  co2: {
    label: "CO2 (ppm)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

function SensorChart({ data, sensorType }: { data: SensorReading[], sensorType: SensorType }) {
  const chartData = data.map(d => ({
    time: format(d.timestamp as number, "HH:mm"),
    [sensorType]: sensorType === 'pm25' ? d.pm2_5 : (d as any)[sensorType],
  }));

  const config = { [sensorType]: chartConfig[sensorType] } as ChartConfig;

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
    { type: 'temperature', label: 'Temperature', icon: <Thermometer className="mr-2 h-4 w-4" /> },
    { type: 'humidity', label: 'Humidity', icon: <Droplets className="mr-2 h-4 w-4" /> },
    { type: 'pm25', label: 'PM2.5', icon: <Cloud className="mr-2 h-4 w-4" /> },
    { type: 'co2', label: 'CO2', icon: <Wind className="mr-2 h-4 w-4" /> },
];

export function HistoryView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const historicalData = useMemo(() => {
    if (!date) return [];
    return getMockHistoricalData(format(date, "yyyy-MM-dd")).readings;
  }, [date]);

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
              disabled={(d) => d > new Date() || d < new Date("2020-01-01")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sensor Data for {date ? format(date, "MMMM d, yyyy") : '...'}</CardTitle>
          <CardDescription>Select a sensor to see its data throughout the day.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature">
            <TabsList>
              {sensorTabs.map(tab => (
                 <TabsTrigger key={tab.type} value={tab.type}>{tab.icon}{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            {sensorTabs.map(tab => (
                <TabsContent key={tab.type} value={tab.type}>
                    <SensorChart data={historicalData} sensorType={tab.type} />
                </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
