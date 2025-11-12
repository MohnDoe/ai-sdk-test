import { type WeatherTool } from "@/app/lib/ai/tools/weather";
import { UIToolInvocation } from "ai";
import { WeatherCard } from "./card";
import { memo } from "react";

export const WeatherToolComponent = memo(function WeatherToolComponent({ part }: { part: UIToolInvocation<WeatherTool> }) {
    switch (part.state) {
        case 'input-streaming':
        case 'input-available':
            return <div>Getting weather for </div>;
        case 'output-available':
            return <WeatherCard
                city={part.input.city}
                current={part.output?.current!}
                daily={part.output?.daily}
                hourly={part.output?.hourly}
                unit={part.input.unit}
                date={new Date(part.input.date)}
            />;
        case 'output-error':
            return <div>Error: {part.errorText}</div>;
        default:
            return null;
    }
});