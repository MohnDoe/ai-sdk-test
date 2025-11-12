import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools
} from "@/components/ai-elements/prompt-input";
import { ChatStatus } from "ai";
import { useState } from "react";

export function ChatInput({
    onSubmit,
    status,
}: {
    onSubmit: (message: PromptInputMessage) => void;
    status: ChatStatus;
}) {
    const [input, setInput] = useState("");

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        if (!hasText) return;

        onSubmit({ text: message.text });
        setInput("");
    };

    return (
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
    );
}