import { getWeather } from "@/app/lib/weather/weather";
import { InferUITool, tool } from "ai";
import { z } from "zod";

export const inputSchema = z.object({
    city: z.string().describe("The city to get the weather for"),
    unit: z.enum(["fahrenheit", "celsius"]).default("celsius").describe("The unit to use for the weather"),
    date: z.string().describe(`The date and time for weather (in the user's timezone`),
    granularity: z.enum(["hourly", "daily"]).default("daily").describe("The granularity of the weather forecast"),
    timezone: z.string().describe("The timezone to use for the weather in correct TZ identifier format"),
})

export const currentWeatherSchema = z.object({
    time: z.number().describe("The date of the forecast in number of milliseconds since the epoch"),
    temperature: z.number().describe("The temperature for the date in the given unit"),
    weatherCode: z.number().describe("The weather code of the forecast"),
    isDay: z.boolean().describe("Whether the forecast is for the day or night")
}).describe("The current weather");

export const hourlyWeatherSchema = z.object({
    time: z.string().describe("The time for the hourly forecast in number of milliseconds since the epoch"),
    temperature: z.number().describe('The temperature for the hourly forecast'),
    weatherCode: z.number().describe('The weather code for the hourly forecast'),
    isDay: z.boolean().describe("Whether the forecast is for the day or night")
})

export const dailyWeatherSchema = z.object({
    time: z.string().describe("The date for the forecast in number of milliseconds since the epoch"),
    weatherCode: z.number().describe('The weather code for the forecast'),
    temperatureMax: z.number().describe('The maximum temperature for the forecast'),
    temperatureMin: z.number().describe('The minimum temperature for the forecast'),
})

export const outputSchema = z.object({
    current: currentWeatherSchema,
    hourly: z.array(hourlyWeatherSchema).optional().describe("The hourly forecast for today"),
    daily: z.array(dailyWeatherSchema).optional().describe("The daily forecast for the next days")
})

export const getWeatherForCity = tool({
    description: "Get the weather in a given city in a given unit and date",
    inputSchema,
    outputSchema,
    execute: async ({ city, unit, granularity, timezone }) => {
        const weatherResponse = await getWeather({ city, unit, timezone });
        if (!weatherResponse) return null;

        let response = {
            current: {
                time: weatherResponse.current.time.getTime(),
                temperature: weatherResponse.current.temperature_2m,
                weatherCode: weatherResponse.current.weather_code,
                isDay: weatherResponse.current.is_day === 1,
            },
            daily: granularity === "daily" ? weatherResponse.daily.time.map((time, i) => ({
                time: time.toString(),
                weatherCode: weatherResponse.daily.weather_code?.[i]!,
                temperatureMax: weatherResponse.daily.temperature_2m_max?.[i]!,
                temperatureMin: weatherResponse.daily.temperature_2m_min?.[i]!,
            })) : undefined,
            hourly: granularity === "hourly" ? weatherResponse.hourly.time.map((time, i) => ({
                time: time.toString(),
                temperature: weatherResponse.hourly.temperature_2m?.[i]!,
                weatherCode: weatherResponse.hourly.weather_code?.[i]!,
                isDay: weatherResponse.hourly.is_day?.[i]! === 1,
            })) : undefined,
        }

        return response;
    }
})

export type WeatherTool = InferUITool<typeof getWeatherForCity>;