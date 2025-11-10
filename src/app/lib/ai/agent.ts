import { getWeatherForCity } from "@/app/lib/ai/tools/weather";
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
        - today's date is ${new Date().toLocaleDateString()}.
        - ask follow up questions to nudge user into the optimal flow based on the tools you can use
        - don't invent features or nudge the user into information you can't get
        - ask for any details you don't know, like date or location
        - assume the use uses Celcius unless stated otherwise
  `,
  tools,
  stopWhen: stepCountIs(5),
});

export type ChatUITools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatUITools>;

export default agent;
