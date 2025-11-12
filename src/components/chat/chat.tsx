"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInputMessage
} from "@/components/ai-elements/prompt-input";
import { ChatHeader } from "@/components/chat/header";
import { ChatInput } from "@/components/chat/input";
import { WeatherToolComponent } from "@/components/chat/tools/weather/component";
import { ChatMessage } from "@/lib/ai/agent";
import { Conversation as ConversationType, useConversationStore } from "@/lib/ai/conversation/store";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef } from "react";
import { Shimmer } from "../ai-elements/shimmer";
import { Bot } from "lucide-react";

export function Chat({ conversation }: { conversation: ConversationType }) {
  const { addMessageToConversation } = useConversationStore();
  const firstMessageSent = useRef(false)
  const { messages, sendMessage, status, regenerate } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: ({ message }) => {
      addMessageToConversation(conversation.id, message);
    },
    messages: conversation.messages ?? [],
  });

  useEffect(() => {
    if (firstMessageSent.current === false) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];

      if (lastMessage.role == "user") {
        regenerate({ messageId: lastMessage.id });
      }
      firstMessageSent.current = true;
    }
  }, [])

  const handleSendMessage = (message: PromptInputMessage) => {
    addMessageToConversation(conversation.id, {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: message.text! }],
    });

    sendMessage({ text: message.text! });
  };

  return (
    <div className="relative flex flex-col divide-y overflow-hidden grow shrink max-h-full">
      <ChatHeader title={conversation.title ?? "Nouvelle conversation"} />
      <div className="flex flex-col grow shrink overflow-y-auto">
        <Conversation>
          <ConversationContent>
            {messages.length == 0 ? (
              <ConversationEmptyState />
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col gap-4">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message from={message.role} key={message.id}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        );
                      case "tool-getWeatherForCity":
                        return <WeatherToolComponent key={`${i}-${message.id}-${part.type}`} part={part} />;
                      default:
                        return null;
                    }
                  })}
                </div>
              ))
            )}
            {status == "streaming" || status == 'submitted' && <Shimmer>Thinking...</Shimmer>}
          </ConversationContent>
        </Conversation>
        <div className="w-full px-4 pb-4 mt-2">
          <ChatInput onSubmit={handleSendMessage} status={status} />
        </div>
      </div>
    </div>
  );
}
