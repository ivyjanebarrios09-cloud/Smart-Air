'use server';

/**
 * @fileOverview A flow to generate a daily summary of air quality, highlighting unusual spikes or concerning trends.
 *
 * - generateAirQualitySummary - A function that generates the air quality summary.
 * - AirQualitySummaryInput - The input type for the generateAirQualitySummary function.
 * - AirQualitySummaryOutput - The return type for the generateAirQualitySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AirQualitySummaryInputSchema = z.object({
  date: z.string().describe('The date for which to generate the summary in YYYY-MM-DD format.'),
  temperatureReadings: z.array(z.number()).describe('Array of temperature readings for the day.'),
  humidityReadings: z.array(z.number()).describe('Array of humidity readings for the day.'),
  pm25Readings: z.array(z.number()).describe('Array of PM2.5 readings for the day.'),
  mq135Readings: z.array(z.number()).describe('Array of MQ135 readings for the day.'),
});
export type AirQualitySummaryInput = z.infer<typeof AirQualitySummaryInputSchema>;

const AirQualitySummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the air quality for the day, highlighting any unusual spikes or concerning trends.'),
});
export type AirQualitySummaryOutput = z.infer<typeof AirQualitySummaryOutputSchema>;

export async function generateAirQualitySummary(input: AirQualitySummaryInput): Promise<AirQualitySummaryOutput> {
  return airQualitySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'airQualitySummaryPrompt',
  input: {schema: AirQualitySummaryInputSchema},
  output: {schema: AirQualitySummaryOutputSchema},
  prompt: `You are an environmental monitoring expert. You are tasked with providing a daily summary of air quality based on sensor readings.

  Date: {{{date}}}
  Temperature Readings: {{{temperatureReadings}}}
  Humidity Readings: {{{humidityReadings}}}
  PM2.5 Readings: {{{pm25Readings}}}
  MQ135 Readings: {{{mq135Readings}}}

  Analyze the provided sensor readings and generate a concise summary of the air quality for the day. Highlight any unusual spikes or concerning trends in temperature, humidity, PM2.5, and MQ135 levels. Focus on providing insights into the overall air quality situation without requiring the user to analyze individual data points. Mention potential causes for any concerning trends, such as increased pollution or unusual weather patterns. The summary should be easily understandable for a non-expert user.
  Make sure to describe what each reading means, and their units of measurement.
  The temperature is in Celsius, PM2.5 is in micrograms per cubic meter, and MQ135 is in PPM.
  `,
});

const airQualitySummaryFlow = ai.defineFlow(
  {
    name: 'airQualitySummaryFlow',
    inputSchema: AirQualitySummaryInputSchema,
    outputSchema: AirQualitySummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
