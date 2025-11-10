"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, InferAgentUIMessage } from "ai";
import { Fragment, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "../ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "../ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import { ChatHeader } from "./header";
import agent from "@/app/lib/ai/agent";

type MyAgentUIMessage = InferAgentUIMessage<typeof agent>;

export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat<MyAgentUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    sendMessage({ text: message.text! });
    setInput("");
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden grow shrink max-h-full">
      <ChatHeader title="Quel est le sens de la vie ?" />
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
