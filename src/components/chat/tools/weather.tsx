import { type WeatherTool } from "@/app/lib/ai/tools/weather";
import { Badge } from "@/components/ui/badge";
import { UIToolInvocation } from "ai";
import dayjs from "dayjs";
import { MapPin, Pin, PinIcon } from "lucide-react";
import Image from "next/image";


const getWeatherIcon = (code: number | null) => {
    let c = "01";
    // add a leading 0 to code
    if (code && code < 10) {
        c = code.toString().padStart(2, '0');
    }
    return `https://openweathermap.org/img/wn/${c}d@2x.png`
}


export function WeatherToolComponent({ part }: { part: UIToolInvocation<WeatherTool> }) {
    switch (part.state) {
        case 'input-streaming':
        case 'input-available':
            return <div>Getting weather for </div>;
        case 'output-available':
            return (
                <div className="max-w-full shrink h-auto overflow-scroll gap-4 flex flex-col">
                    <Badge variant="secondary"><MapPin /> {part.input.city}</Badge>
                    <div className="flex flex-row gap-2">
                        {part.output!.daily.map((day) => (
                            <div key={day.date} className="w-20 bg-accent text-accent-foreground rounded flex flex-col items-center p-4 gap-0 border-0 shadow-none">
                                <span className="text-xs font-semibold">
                                    {dayjs(day.date).format('ddd')}
                                </span>
                                <Image src={getWeatherIcon(day.weatherCode)} alt="Weather icon" width={40} height={40} className="-my-1" />
                                <span className="text-sm font-bold">
                                    {day.temperatureMin && `${Math.floor(day.temperatureMin)}`}/{day.temperatureMax && `${Math.floor(day.temperatureMax)}°`}
                                </span>
                                <div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'output-error':
            return <div>Error: {part.errorText}</div>;
        default:
            return null;
    }
}