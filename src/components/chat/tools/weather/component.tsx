import { Tool, ToolHeader, ToolOutput } from "@/components/ai-elements/tool";
import { type WeatherTool } from "@/lib/ai/tools/weather";
import { UIToolInvocation } from "ai";
import { memo } from "react";
import { WeatherCard } from "./card";

export const WeatherToolComponent = memo(function WeatherToolComponent({ part }: { part: UIToolInvocation<WeatherTool> }) {
    switch (part.state) {
        case 'input-streaming':
        case 'input-available':
            return <Tool defaultOpen={false}>
                <ToolHeader state={part.state} type="tool-getWeatherForCity" title="Getting weather" />
            </Tool>;
        case 'output-available':
            return <WeatherCard
                city={part.input.city}
                current={part.output!.current!}
                daily={part.output!.daily}
                hourly={part.output!.hourly}
                unit={part.input.unit}
                date={new Date(part.input.date)}
            />;
        case 'output-error':
            return <Tool defaultOpen={false}>
                <ToolHeader state={part.state} type="tool-getWeatherForCity" title="Getting weather" />
                <ToolOutput
                    output={part.output ?? undefined}
                    errorText={part.errorText}
                />
            </Tool>;
        default:
            return null;
    }
});