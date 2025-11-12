"use client";

import { useConversationStore } from "@/lib/ai/conversation/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { conversations, isReady } = useConversationStore();
    useEffect(() => {
        if (!isReady) return;
        if (conversations.length > 0) {
            const mostRecentConversation = conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
            router.push(`/conversations/${mostRecentConversation.id}`);
        } else {
            router.push(`/conversations/new`);
        }
    }, [conversations, router, isReady]);

    return null;
}