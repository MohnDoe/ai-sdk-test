export const getWeatherIcon = (code: number | null) => {
    let c = "01";
    // add a leading 0 to code
    if (code && code < 10) {
        c = code.toString().padStart(2, '0');
    }
    return `https://openweathermap.org/img/wn/${c}d@4x.png`
}