import { getWeatherForCity } from "@/lib/ai/tools/weather"
import { mistral } from "@ai-sdk/mistral";
import {
  InferUITools,
  stepCountIs,
  ToolLoopAgent,
  UIDataTypes,
  UIMessage,
} from "ai";

const tools = {
  getWeatherForCity
};

const agent = new ToolLoopAgent({
  model: mistral("mistral-large-latest"),
  instructions: `
        - you help get weather information
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
        - today's date is ${new Date()}.
        - you can only give weather info about today and the next 14 days
        - always use absolute date when using weather related tools
        - if user asks for a particular time, be sure to include it in the date for the weather tools
        - ask follow up questions to nudge user into the optimal flow based on the tools you can use
        - don't invent features or nudge the user into information you can't get
        - ask for any details you don't know, like date or location
        - assume the use uses Celcius unless stated otherwise
        - other than tools only reply in text form
        - when asked about multiple days (like "this week"), don't call "getWeatherForCity" tool multiple time, use the forecast returned by it for the days and give details about time and date
  `,
  tools,
  stopWhen: stepCountIs(5),
});

export type ChatUITools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatUITools>;

export default agent;
