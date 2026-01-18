"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SensorReading } from "@/lib/definitions";
import { useCollection, useFirestore } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  type Timestamp,
} from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { OverallQualityCard } from "@/components/dashboard/overall-quality-card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      orderBy("timestamp", "desc")
    );
  }, [firestore, date]);

  const { data: historicalData, loading: historyLoading } =
    useCollection<SensorReading>(historicalDataQuery);

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

  const sortedHistoricalDataForTable = useMemo(() => {
    if (!historicalData) return [];
    return [...historicalData].sort((a, b) => {
      const tsA = (a.timestamp as Timestamp)?.toMillis() || 0;
      const tsB = (b.timestamp as Timestamp)?.toMillis() || 0;
      return tsA - tsB;
    });
  }, [historicalData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal md:w-[280px]",
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
        dailyAverageReading && (
          <OverallQualityCard reading={dailyAverageReading as SensorReading} />
        )
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detailed Readings</CardTitle>
          <CardDescription>
            A log of all sensor readings for the selected day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <>
              {/* Mobile View */}
              <div className="space-y-4 md:hidden">
                {historicalData.length > 0 ? (
                  historicalData.map((reading) => (
                    <Card key={reading.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">
                          {reading.timestamp &&
                            format(
                              (reading.timestamp as Timestamp).toDate(),
                              "pp"
                            )}
                        </CardTitle>
                        <CardDescription>
                          {reading.air_quality}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 pt-0 text-sm">
                        <div>
                          <p className="text-muted-foreground">Temp</p>
                          <p className="font-medium">
                            {reading.temperature.toFixed(1)}°C
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Humidity</p>
                          <p className="font-medium">
                            {reading.humidity.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">PM2.5</p>
                          <p className="font-medium">
                            {reading.pm2_5.toFixed(1)} µg/m³
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CO2</p>
                          <p className="font-medium">
                            {reading.co2.toFixed(1)} ppm
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    No data for this day.
                  </div>
                )}
              </div>
              {/* Desktop View */}
              <div className="hidden md:block">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="text-right">
                          Temp (°C)
                        </TableHead>
                        <TableHead className="text-right">
                          Humidity (%)
                        </TableHead>
                        <TableHead className="text-right">
                          PM2.5 (µg/m³)
                        </TableHead>
                        <TableHead className="text-right">CO2 (ppm)</TableHead>
                        <TableHead>Quality</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedHistoricalDataForTable.length > 0 ? (
                        sortedHistoricalDataForTable.map((reading) => (
                          <TableRow key={reading.id}>
                            <TableCell className="font-medium">
                              {reading.timestamp &&
                                format(
                                  (reading.timestamp as Timestamp).toDate(),
                                  "MMMM d, yyyy 'at' pp"
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                              {reading.temperature.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              {reading.humidity.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              {reading.pm2_5.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              {reading.co2.toFixed(1)}
                            </TableCell>
                            <TableCell>{reading.air_quality}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center"
                          >
                            No data for this day.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
