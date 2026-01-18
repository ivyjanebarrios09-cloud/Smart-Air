import type { SensorReading, HistoricalData } from "@/lib/definitions";

// MOCK DATA
const generateRandomReading = (base: any) => ({
    temperature: base.temperature + (Math.random() - 0.5) * 2,
    humidity: base.humidity + (Math.random() - 0.5) * 5,
    pm2_5: base.pm2_5 + (Math.random() - 0.5) * 4,
    co2: base.co2 + (Math.random() - 0.5) * 50,
    air_quality: "Good",
});

export const getMockHistoricalData = (date: string): HistoricalData => {
    const readings: SensorReading[] = [];
    const baseTime = new Date(date).setHours(0, 0, 0, 0);
    const baseReadings = {
        temperature: 22,
        humidity: 50,
        pm2_5: 15,
        co2: 600,
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
