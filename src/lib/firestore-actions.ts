'use client';
import { collection, addDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import type { SensorReading } from './definitions';

type NewReading = Omit<SensorReading, 'id' | 'timestamp'>;

export const addSensorReading = (firestore: Firestore, reading: NewReading) => {
    addDoc(collection(firestore, "sensor_history"), {
        ...reading,
        timestamp: serverTimestamp(),
    }).then(() => {
        toast({
            title: "Data point stored",
            description: "A new sensor reading has been saved to the history.",
        });
    }).catch((error: any) => {
        toast({
            variant: "destructive",
            title: "Error storing data",
            description: error.message,
        });
        console.error("Error adding document: ", error);
    });
}
