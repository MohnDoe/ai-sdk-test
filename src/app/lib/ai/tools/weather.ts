import { getWeather } from "@/app/lib/weather/weather";
import { tool } from "ai";
import { date, z } from "zod";

export const getWeatherForCity = tool({
    description: "Get the weather in a given city in a given unit and date",
    inputSchema: z.object({
        city: z.string().describe("The city to get the weather for"),
        unit: z.enum(["fahrenheit", "celsius"]).default("celsius").describe("The unit to use for the weather"),
        date: z.string().describe(`The absolute date to get the weather for (in a dateString format and in the same timezone as ${new Date().toLocaleDateString()})`),
    }),
    outputSchema: z.object({
        weather: z.object({
            date: z.number().describe("The date of the forecast in number of milliseconds since the epoch"),
            temperature: z.number().nullable().describe("The temperature for the date in the given unit"),
            weatherCode: z.number().nullable().describe("The weather code of the forecast"),
        }).nullable().describe("The weather forecast for the date"),
        hourly: z.array(
            z.object({
                time: z.string().describe("The time for the hourly forecast"),
                temperature: z.number().nullable().describe('The temperature for the hourly forecast'),
                weatherCode: z.number().nullable().describe('The weather code for the hourly forecast'),
            })
        ).nullable().describe("The hourly forecast for today"),
        daily: z.array(
            z.object({
                date: z.number().describe("The date for the forecast in number of milliseconds since the epoch"),
                weatherCode: z.number().describe('The weather code for the forecast'),
                temperatureMax: z.number().nullable().describe('The maximum temperature for the forecast'),
                temperatureMin: z.number().nullable().describe('The minimum temperature for the forecast'),
            })
        ).describe("The daily forecast for the next days")
    }),
    execute: async ({ city, unit, date }) => {
        const weatherResponse = await getWeather({ city, unit });
        if (!weatherResponse) return null;

        let weather = null;
        let includeHourly = false;

        const requestedDate = new Date(date);
        requestedDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        // if date is not today fetch the information from the forecast
        if (requestedDate.getTime() !== today.getTime()) {
            includeHourly = false;
            // find in weatherResponse.daily the matching date
            const dailyIndex = weatherResponse.daily.time.findIndex(time => time.getTime() === requestedDate.getTime());
            if (dailyIndex !== -1) {
                weather = {
                    date: weatherResponse.daily.time[dailyIndex].getTime(),
                    weatherCode: weatherResponse.daily.weather_code![dailyIndex],
                    temperature: weatherResponse.daily.temperature_2m_max![dailyIndex],
                }
            }
        } else {
            includeHourly = true;
            weather = {
                date: weatherResponse.current.time.getTime(),
                temperature: weatherResponse.current.temperature_2m,
                weatherCode: weatherResponse.current.weather_code,
            }
        }
        return {
            weather,
            hourly: includeHourly ? weatherResponse.hourly.time.map((time, i) => ({
                time: time.toTimeString(),
                temperature: weatherResponse.hourly.temperature_2m![i],
                weatherCode: weatherResponse.hourly.weather_code![i],
            })) : null,
            daily: weatherResponse.daily.time.map((time, i) => ({
                date: time.getTime(),
                weatherCode: weatherResponse.daily.weather_code![i],
                temperatureMax: weatherResponse.daily.temperature_2m_max![i],
                temperatureMin: weatherResponse.daily.temperature_2m_min![i],
            }))

        }

    }
})