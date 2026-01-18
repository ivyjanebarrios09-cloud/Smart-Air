"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFirestore } from "@/firebase";
import { addSensorReading } from "@/lib/firestore-actions";
import { getOverallStatus } from "@/lib/air-quality";
import { Loader2, PlusCircle } from "lucide-react";
import type { SensorReading } from "@/lib/definitions";

const generateRandomReading = (): Omit<SensorReading, 'id' | 'timestamp'> => {
    const reading = {
        temperature: 15 + Math.random() * 15, // 15 to 30
        humidity: 40 + Math.random() * 40, // 40 to 80
        pm2_5: Math.random() * 50, // 0 to 50
        co2: 400 + Math.random() * 1600, // 400 to 2000
    };
    const air_quality = getOverallStatus(reading);
    return { ...reading, air_quality };
};

export function DataSimulator() {
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateData = () => {
    if (!firestore) {
      console.error("Firestore not available");
      return;
    }
    setIsLoading(true);
    const newReading = generateRandomReading();
    addSensorReading(firestore, newReading);
    
    // Give user feedback and prevent rapid clicks
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-start gap-4">
        <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-semibold leading-none tracking-tight">Data Simulator</h3>
            <p className="text-sm text-muted-foreground">
                This will write a new random sensor reading to your Firestore database, which will then appear on the dashboard and in the history.
            </p>
        </div>
      <Button onClick={handleGenerateData} disabled={!firestore || isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="mr-2 h-4 w-4" />
        )}
        Store New Reading
      </Button>
    </div>
  );
}
