import agent, { ChatMessage } from "@/app/lib/ai/agent";
import { createAgentUIStreamResponse } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  return createAgentUIStreamResponse({
    agent,
    messages,
  });
}
