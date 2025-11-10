import { getWeatherForCity } from "@/app/lib/ai/tools/weather";
import { mistral } from "@ai-sdk/mistral";
import {
  InferUITools,
  stepCountIs,
  ToolLoopAgent,
  ToolSet,
  UIDataTypes,
  UIMessage,
} from "ai";

const tools: ToolSet = {
  getWeatherForCity
};

const agent = new ToolLoopAgent({
  model: mistral("mistral-large-latest"),
  instructions: `
  You are a friendly weather assistant.
  You speak the language of the user and try your best to anwser their questions.

  When asked about the weather or meteo conditions use "getWeatherForCity" tool. Use Celcius by default.
  `,
  tools,
  stopWhen: stepCountIs(5),
});

export type ChatUITools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatUITools>;

export default agent;
