import { getWeather } from "@/app/lib/weather/weather";
import { tool } from "ai";
import { z } from "zod";

export const getWeatherForCity = tool({
    description: "Get the weather in a given city in a given unit",
    inputSchema: z.object({
        city: z.string().describe("The city to get the weather for"),
        unit: z.enum(["fahrenheit", "celsius"]).default("celsius").describe("The unit to use for the weather"),
    }),
    outputSchema: z.object({
        temperature: z.number().describe("The temperature in the given unit"),
        daily: z.object({
            dates: z.array(z.string()).describe("The dates for the forecast"),
            temperaturesMax: z.array(z.number()).describe("The temperatures max for the forecast"),
            temperaturesMin: z.array(z.number()).describe("The temperatures min for the forecast"),
            weatherCodes: z.array(z.number()).describe("The weather codes for the forecast"),
        })
    }),
    execute: async ({ city, unit }) => {
        try {
            const weather = await getWeather({ city, unit });


            if (!weather) return null;

            return {
                temperature: weather.current.temperature_2m,
                daily: {
                    dates: weather.daily.time.map(date => date.toISOString()),
                    temperaturesMax: Array.from(weather.daily.temperature_2m_max || []),
                    temperaturesMin: Array.from(weather.daily.temperature_2m_min || []),
                    weatherCodes: Array.from(weather.daily.weather_code || []),
                }
            }
        } catch (error) {
            console.error(error);
            return null;
        }

    }
})