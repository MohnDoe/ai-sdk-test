import agent from "@/app/lib/ai/agent";
import {
  convertToModelMessages,
  createAgentUIStreamResponse,
  UIMessage,
} from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log(messages);

  return createAgentUIStreamResponse({
    agent,
    messages,
  });
}
