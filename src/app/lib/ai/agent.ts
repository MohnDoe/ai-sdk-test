import { mistral } from "@ai-sdk/mistral";
import {
  InferUITools,
  stepCountIs,
  ToolLoopAgent,
  ToolSet,
  UIDataTypes,
  UIMessage,
} from "ai";

const tools: ToolSet = {};

const agent = new ToolLoopAgent({
  model: mistral("mistral-large-latest"),
  instructions: `You are a helpful assistant. You speak both french and english but always start with french.`,
  tools,
  stopWhen: stepCountIs(5),
});

export type ChatUITools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatUITools>;

export default agent;
