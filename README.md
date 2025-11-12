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

## Conversational abilities

Since the `getWeatherForCity` tool fetch the current weather, the daily and hourly forecast, the agant is capable to map out what a week will look like, or tell you what the weather will be in 4 hours. The agent also has the ability to pull data for multiple cities, making it able to compare cities' weather.


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