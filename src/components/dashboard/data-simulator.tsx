"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFirestore } from "@/firebase";
import { addSensorReading } from "@/lib/firestore-actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

// Base readings for generating random data
const baseReadings = {
    temperature: 25,
    humidity: 60,
    pm2_5: 25,
    co2: 500,
};

const generateRandomReading = () => ({
    temperature: baseReadings.temperature + (Math.random() - 0.5) * 10,
    humidity: baseReadings.humidity + (Math.random() - 0.5) * 20,
    pm2_5: baseReadings.pm2_5 + (Math.random() - 0.5) * 50,
    co2: baseReadings.co2 + (Math.random() - 0.5) * 400,
});

export function DataSimulator() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleStoreReading = async () => {
        if (!firestore) {
            toast({
                variant: "destructive",
                title: "Firestore not available",
                description: "Please check your Firebase connection.",
            });
            return;
        }
        setIsLoading(true);

        const newReading = generateRandomReading();
        
        try {
          // The air_quality will be calculated and added by addSensorReading
          await addSensorReading(firestore, newReading);
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Simulator</CardTitle>
                <CardDescription>
                    Generate and store a new random sensor reading in Firestore.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleStoreReading} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Store New Reading
                </Button>
            </CardContent>
        </Card>
    );
}
