import clsx from "clsx";
import dayjs from "dayjs";
import Image from "next/image";
import { getWeatherIcon } from "./utils";

export function SmallWeatherCard({
    granularity,
    date,
    weatherCode,
    temperature,
    temperatureUnit,
    temperatureMin,
    temperatureMax,
    isSelected,
    onClick,
}: {
    granularity: "daily" | "hourly";
    date: Date;
    weatherCode: number;
    temperatureUnit: string;
    temperature?: number;
    temperatureMin?: number;
    temperatureMax?: number;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <div onClick={onClick} className={
            clsx("w-20 rounded flex flex-col items-center p-4 gap-0 shadow-none transition-colors duration-200 cursor-pointer box-content border-4",
                {
                    "border-accent": isSelected,
                    "border-transparent bg-accent text-accent-foreground": !isSelected
                }
            )}>
            <span className="text-xs font-semibold">
                {dayjs(date).format(granularity === 'daily' ? 'ddd' : 'HH:mm')}
            </span>
            {
                granularity === 'hourly' &&
                <span className="text-xs">
                    {dayjs(date).format('ddd')}
                </span>
            }
            <Image src={getWeatherIcon(weatherCode)} alt="Weather icon" width={40} height={40} className="-my-1" />
            <span className="text-sm font-bold">
                {
                    granularity === 'hourly' ?
                        temperature!.toFixed(1) + temperatureUnit :
                        `${Math.round(temperatureMin!)}/${Math.round(temperatureMax!) + temperatureUnit}`
                }
            </span>
        </div >)
}