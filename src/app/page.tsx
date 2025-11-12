"use client";

import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { ChatInput } from "@/components/chat/input";
import { useConversationStore } from "@/lib/ai/conversation/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter()
    const { clearActiveConversationId, isReady, createConversation, setActiveConversationId, addMessageToConversation } = useConversationStore();

    const suggestions = [
        {
            topText: 'Quelle est la météo',
            bottomText: 'à Nancy ?'
        },
        {
            topText: 'Va-t-il faire beau',
            bottomText: 'cette semaine à Paris ?'
        },
        {
            topText: 'Combien fera-t-il',
            bottomText: 'dans 4 heures ?'
        },
        {
            topText: "Fait-il plus chaud",
            bottomText: "à Metz ou à Marseille ?"
        }
    ]


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

    const handleSuggestionClick = (suggestion: string) => {
        handleFirstMessage({ text: suggestion })
    }

    return <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col gap-8 items-center w-[75%]">
            <span className="text-2xl font-bold">Que puis-je pour vous ?</span>
            <div className="flex flex-col w-full gap-2">
                <Suggestions>
                    {suggestions.map((suggestion, i) => (
                        <Suggestion
                            key={`suggestion-${i}`}
                            onClick={() => handleSuggestionClick(`${suggestion.topText} ${suggestion.bottomText}`)}
                            suggestion=""
                            className="flex flex-col gap-0 items-start justify-center h-fit py-2 px-4 rounded-xl"
                        >
                            <b>{suggestion.topText}</b>
                            <span className="text-xs">{suggestion.bottomText}</span>
                        </Suggestion>
                    ))}
                </Suggestions>
                <ChatInput
                    onSubmit={handleFirstMessage}
                    status="ready"
                />
            </div>
        </div>
    </div>;
}