"use client";

import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ChatInput } from "@/components/chat/input";
import { useConversationStore } from "@/lib/ai/conversation/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter()
    const { clearActiveConversationId, isReady, createConversation, setActiveConversationId, addMessageToConversation } = useConversationStore();

    useEffect(() => {
        if (!isReady) return;
        clearActiveConversationId();
    }, [isReady])

    const handleFirstMessage = (message: PromptInputMessage) => {
        const newConversationId = createConversation();
        addMessageToConversation(newConversationId, {
            id: crypto.randomUUID(),
            role: "user",
            parts: [{ type: "text", text: message.text! }],
        });

        router.push(`/conversations/${newConversationId}`);
    }


    return <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col gap-8 items-center w-[75%]">
            <span className="text-2xl font-bold">Que puis-je pour vous ?</span>
            <ChatInput
                onSubmit={handleFirstMessage}
                status="ready"
            />
        </div>
    </div>;
}