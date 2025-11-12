"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversationStore } from "@/lib/ai/conversation/store";

export default function NewConversationPage() {
    const router = useRouter();
    const { createConversation } = useConversationStore()

    useEffect(() => {
        const newConversationId = createConversation();
        router.push(`/conversations/${newConversationId}`);
    }, [])
}