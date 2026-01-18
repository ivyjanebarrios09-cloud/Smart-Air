import type { LatestSensorReadings, SensorReading, HistoricalData } from "@/lib/definitions";

// MOCK DATA
const generateRandomReading = (base: any) => ({
    temperature: base.temperature + (Math.random() - 0.5) * 2,
    humidity: base.humidity + (Math.random() - 0.5) * 5,
    pm25: base.pm25 + (Math.random() - 0.5) * 4,
    mq135: base.mq135 + (Math.random() - 0.5) * 20,
});

export const getMockLatestReadings = (): LatestSensorReadings => {
    const base = {
        temperature: 24,
        humidity: 45,
        pm25: 10,
        mq135: 80,
    };
    return {
        ...generateRandomReading(base),
        lastUpdated: Date.now(),
    };
};

export const getMockHistoricalData = (date: string): HistoricalData => {
    const readings: SensorReading[] = [];
    const baseTime = new Date(date).setHours(0, 0, 0, 0);
    const baseReadings = {
        temperature: 22,
        humidity: 50,
        pm25: 15,
        mq135: 120,
    };

    for (let i = 0; i < 24 * 4; i++) { // every 15 minutes
        const timestamp = baseTime + i * 15 * 60 * 1000;
        readings.push({
            timestamp,
            ...generateRandomReading(baseReadings),
        });
    }

    return { date, readings };
};
