import { currentWeatherSchema, dailyWeatherSchema, hourlyWeatherSchema } from "@/lib/ai/tools/weather"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import dayjs from "dayjs";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import z from "zod";
import { SmallWeatherCard } from "./smallCard";
import { getWeatherIcon } from "./utils";
type CurrentWeather = z.infer<typeof currentWeatherSchema>;
type DailyWeather = z.infer<typeof dailyWeatherSchema>
type HourlyWeather = z.infer<typeof hourlyWeatherSchema>


const WeatherCardHeader = (
    {
        date,
        temperatureUnit,
        weather,
        isDay
    }:
        {
            date: Date,
            temperatureUnit: string,
            weather: CurrentWeather | DailyWeather | HourlyWeather,
            isDay?: boolean
        }
) => {
    const isDaily = 'temperatureMax' in weather && 'temperatureMin' in weather;
    const dateObject = dayjs(date);

    return (
        <CardHeader className="flex flex-row gap-8 items-center justify-between py-0 px-4">
            <div className="flex flex-col grow">
                <span className="text-sm">{dateObject.format(isDaily ? "dddd, MMMM D" : "dddd, MMMM D @ HH:mm")}</span>
                {isDaily ? (
                    <span className="text-5xl font-black">{Math.round(weather.temperatureMax)}/{Math.round(weather.temperatureMin)}{temperatureUnit}</span>
                ) : (
                    <span className="text-5xl font-black">{(weather as CurrentWeather | HourlyWeather).temperature.toFixed(1)}{temperatureUnit}</span>
                )}
            </div>
            <Image src={getWeatherIcon(weather.weatherCode, 4, isDay)} alt="Weather icon" width={200} height={200} className="-my-10" />
        </CardHeader>
    )
}
export function WeatherCard({
    current,
    daily,
    hourly,
    unit,
    city,
    date
}: {
    current: CurrentWeather;
    daily?: DailyWeather[];
    hourly?: HourlyWeather[];
    unit: 'celsius' | 'fahrenheit';
    city: string;
    date: Date;
}) {
    const [selectedDate, setSelectedDate] = useState(date);
    const [displayedWeather, setDisplayedWeather] = useState<DailyWeather | HourlyWeather | CurrentWeather>(current);
    const selectedCardRef = useRef(null);

    useLayoutEffect(() => {
        if (selectedCardRef.current) {
            (selectedCardRef.current as HTMLDivElement).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }
    }, [selectedDate]);

    useEffect(() => {
        if (daily) {
            setDisplayedWeather(daily.find(d => dayjs(d.time).isSame(selectedDate, 'day')) ?? daily[0]);
        } else if (hourly) {
            setDisplayedWeather(hourly.find(h => dayjs(h.time).isSame(selectedDate, 'hour')) ?? hourly[0]);
        } else {
            setDisplayedWeather(current);
        }
    }, [])

    const tempUnit = unit === 'celsius' ? '°C' : '°F';
    return (
        <div className="shrink h-auto  gap-4 flex flex-col max-w-xl">
            <Badge variant="secondary"><MapPin /> {city}</Badge>
            <Card className="py-2 gap-4">
                <WeatherCardHeader
                    date={new Date(displayedWeather.time)}
                    temperatureUnit={tempUnit}
                    weather={displayedWeather}
                    isDay={(displayedWeather as HourlyWeather).isDay ?? true}
                />
                <CardContent className="px-4 overflow-hidden">
                    <div className="flex flex-row gap-2 overflow-x-scroll">
                        {daily?.map((day, i) => {
                            const isSelected = dayjs(selectedDate).isSame(new Date(day.time), 'day');

                            return (
                                <div
                                    ref={isSelected ? selectedCardRef : null}
                                    key={`daily-card-${i}`}
                                >
                                    <SmallWeatherCard
                                        date={new Date(day.time)}
                                        granularity="daily"
                                        temperatureUnit={tempUnit}
                                        temperatureMin={day.temperatureMin}
                                        temperatureMax={day.temperatureMax}
                                        weatherCode={day.weatherCode}
                                        isSelected={isSelected}
                                        onClick={() => {
                                            setSelectedDate(new Date(day.time));
                                            setDisplayedWeather(day);
                                        }}
                                    />
                                </div>
                            )
                        })}
                        {hourly?.map((hour, i) => {
                            const isSelected = dayjs(selectedDate).isSame(new Date(hour.time), 'hour');
                            return (
                                <div
                                    ref={isSelected ? selectedCardRef : null}
                                    key={`hourly-card-${i}`}
                                >
                                    <SmallWeatherCard
                                        date={new Date(hour.time)}
                                        granularity="hourly"
                                        temperatureUnit={tempUnit}
                                        temperature={hour.temperature}
                                        weatherCode={hour.weatherCode}
                                        isSelected={isSelected}
                                        onClick={() => {
                                            setSelectedDate(new Date(hour.time));
                                            setDisplayedWeather(hour);
                                        }}
                                        isDay={hour.isDay ?? true}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

}
