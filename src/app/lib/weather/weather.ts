import { fetchWeatherApi, } from "openmeteo";

const OWM_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

if (!OWM_API_KEY) {
    throw new Error("OPENWEATHERMAP_API_KEY is not defined");
}

export async function getWeather({ city, unit, timezone = "auto" }: { city: string, unit: "fahrenheit" | "celsius", timezone?: string }) {
    const coords = await getCityCoords(city);

    if (!coords) return null;

    const { lon, lat } = coords;

    const params = {
        latitude: lat,
        longitude: lon,

        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        hourly: ["temperature_2m", "weather_code", "is_day"],
        current: ["temperature_2m", "weather_code"],
        timezone,
        forecast_days: 14,
        temperature_unit: unit
    }

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    if (!response) return null;

    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const daily = response.daily()!;
    const hourly = response.hourly()!;


    // weird API, their doc requires this kind of manipulation. I'll stick with it for now.
    // TODO: change API maybe
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0)!.value(),
            weather_code: current.variables(1)!.value(),
        },
        hourly: {
            time: Array.from(
                { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m: hourly.variables(0)!.valuesArray(),
            weather_code: hourly.variables(1)!.valuesArray(),
            is_day: hourly.variables(2)!.valuesArray(),
        },
        daily: {
            time: Array.from(
                { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            weather_code: daily.variables(0)!.valuesArray(),
            temperature_2m_max: daily.variables(1)!.valuesArray(),
            temperature_2m_min: daily.variables(2)!.valuesArray(),
        },
    };
    return weatherData;
}

export async function getCityCoords(city: string) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OWM_API_KEY}`);
    const data = await response.json();

    if (!data.length) return null;

    return {
        name: data[0].name,
        lat: data[0].lat,
        lon: data[0].lon,
    };
}