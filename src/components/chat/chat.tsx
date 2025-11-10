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
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ChatHeader } from "@/components/chat/header";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Fragment, useState } from "react";

export function Chat({ conversation }: { conversation: ConversationType }) {
  const { addMessageToConversation } = useConversationStore();
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: ({ message }) => {
      addMessageToConversation(conversation.id, message);
    },
    messages: conversation.messages,
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    addMessageToConversation(conversation.id, {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: message.text! }],
    });

    sendMessage({ text: message.text! });
    setInput("");
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden grow shrink max-h-full">
      <ChatHeader title={conversation.title ?? "Nouvelle conversation"} />
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.length == 0 ? (
              <ConversationEmptyState />
            ) : (
              messages.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message from={message.role} key={message.id}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        );
                    }
                  })}
                </Fragment>
              ))
            )}
          </ConversationContent>
        </Conversation>
        <div className="w-full px-4 pb-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
