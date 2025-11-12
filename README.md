# Aïe AI

Weather-focused chatbot using Next.js and the Vercel AI SDK v6.

## Overview

The application provides a chat interface where users can ask for weather information for a specific city. The backend is powered by a `ToolLoopAgent` using the Mistral Large model, which can use tools to fetch real-time weather data.

## Key Features

*   **Conversational AI**: Utilizes the Mistral Large language model via the `@ai-sdk/mistral` package to understand and respond to user queries about the weather.
*   **Persistant Chat**: Using Zustand, the chat is saved on local storage
*   **Tool-Using Agent**: The AI agent is equipped with a `getWeatherForCity` tool to fetch current and forecast weather data.
*   **Weather Data**: Integrates with the Open-Meteo and OpenWeatherMap APIs to get weather forecasts and city coordinates.
*   **Streaming Responses**: The chat interface streams responses from the AI agent for a real-time feel.
*   **Lazy loading tools**: Skeleton card will be placed while the AI agent fetch data

## Tools

### How `getWeatherForCity` works

The model first map out the input for the tool depending on what the user is asking (ie: `city`, `date`, `unit`). And proceed as follows : 

1. Fetch the longitude and lattitude of the city using OpenWeatherMap
2. Fetch weather data from Open-Meteo using the acquired longitude and lattitude, as well as the unit
3. Parse the data
4. Send it

#### On the tool UI

The UI is able to display different state of the tool, this is useful if the tool takes time to load.
Depending on the tool `output` the tool will display either a list of dates with weather data or a list of hours.
If the agent understood correctly the `data` of the query, the tool will display this information first. But the user is free to click on any other data listed to display it as well.
The component also uses the tool `input` to display the correct city name and the correct temperature unit.

## Conversational abilities

Since the `getWeatherForCity` tool fetch the current weather, the daily and hourly forecast, the agant is capable to map out what a week will look like, or tell you what the weather will be in 4 hours. The agent also has the ability to pull data for multiple cities, making it able to compare cities' weather.

Mistral AI being smart, it can also infer informations such as : what you should wear for a type of activity outside. What the `WMO weather codes` means ("sunny", "cloudy").


## Getting Started

### Prerequisites

*   npm, yarn, pnpm or **bun (recommended)**
*   An OpenWeatherMap API key
*   A Mistral AI API key

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd aie-compta
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Set up environment variables. Create a `.env.local` file in the root of the project and add your OpenWeatherMap API key:
    ```
    MISTRAL_API_KEY=your_api_key
    OPENWEATHERMAP_API_KEY=your_api_key_here
    ```

### Running the Development Server

To start the development server, run:

```bash
bun dev