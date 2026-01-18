import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {}

export type SensorReading = {
  timestamp: number;
  temperature: number;
  humidity: number;
  pm25: number;
  mq135: number;
};

export type LatestSensorReadings = Omit<SensorReading, 'timestamp'> & {
    lastUpdated: number;
};

export type HistoricalData = {
    date: string;
    readings: SensorReading[];
};

export type AirQualityStatus = "Good" | "Moderate" | "Poor" | "N/A";

export type SensorType = "temperature" | "humidity" | "pm25" | "mq135";
