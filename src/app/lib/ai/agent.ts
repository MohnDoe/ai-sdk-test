import { mistral } from "@ai-sdk/mistral";
import { stepCountIs, ToolLoopAgent } from "ai";

const agent = new ToolLoopAgent({
  model: mistral("mistral-large-latest"),
  instructions: `You are a helpful assistant. You speak both french and english but always start with french.`,
  stopWhen: stepCountIs(5),
});

export default agent;
