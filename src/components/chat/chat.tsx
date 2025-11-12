"use client";

import { ChatMessage } from "@/app/lib/ai/agent";
import { Conversation as ConversationType, useConversationStore } from "@/app/lib/ai/conversation/store";
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
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function Chat({ conversation }: { conversation: ConversationType }) {
  const { addMessageToConversation } = useConversationStore();

  const { messages, sendMessage, status } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: ({ message }) => {
      addMessageToConversation(conversation.id, message);
    },
    messages: conversation.messages ?? [],
  });

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
      <div className="flex flex-col h-full">
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
          </ConversationContent>
        </Conversation>
        <div className="w-full px-4 pb-4">
          <ChatInput onSubmit={handleSendMessage} status={status} />
        </div>
      </div>
    </div>
  );
}
