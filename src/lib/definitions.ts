import type { User as FirebaseUser } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface User extends FirebaseUser {}

export type SensorReading = {
  id?: string;
  timestamp: Timestamp | number;
  temperature: number;
  humidity: number;
  pm25: number;
  co2: number;
  air_quality: string;
};

export type HistoricalData = {
    date: string;
    readings: SensorReading[];
};

export type AirQualityStatus = "Good" | "Moderate" | "Poor" | "N/A";

export type SensorType = "temperature" | "humidity" | "pm25" | "co2";
