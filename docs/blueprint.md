# **App Name**: Air Insights

## Core Features:

- Real-time Data Ingestion: Collect sensor data (temperature, humidity, PM2.5, MQ135) from an ESP32 and store it in Firestore.
- Dashboard View: Display the latest sensor readings in a clear and concise dashboard.
- Status Indicators: Implement status indicators (Good/Moderate/Poor) based on air quality data.
- Historical Data Logging: Store sensor data daily, grouped by date (YYYY-MM-DD) in Firestore.
- Historical Data Visualization: Generate interactive line charts for each sensor (temperature, humidity, PM2.5, MQ135) for historical data, filterable by day and sensor type.
- Real-time Updates: Implement real-time updates using Firestore to display new readings without page refresh.
- User Authentication: Implement user sign-up and login functionality for personalized data access.

## Style Guidelines:

- Primary color: Deep teal (#008080) to represent a sense of calm and environmental awareness.
- Background color: Light grey (#F0F0F0) for a clean, modern look.
- Accent color: Bright green (#00FF00) to highlight important data points and status indicators, conveying a sense of health.
- Body and headline font: 'PT Sans', a modern sans-serif typeface suitable for headlines or body text.
- Use simple, modern icons to represent sensor types and data points.
- Implement a responsive, mobile-friendly layout using a grid system.
- Use subtle animations to indicate data updates and improve user experience.